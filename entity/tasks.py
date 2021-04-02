import json

from airone.lib.types import AttrTypeValue
from airone.celery import app
from entity.models import Entity, EntityAttr
from user.models import User
from job.models import Job


@app.task(bind=True)
def create_entity(self, job_id):
    job = Job.objects.get(id=job_id)

    if job.proceed_if_ready():
        # At the first time, update job status to prevent executing this job duplicately
        job.update(Job.STATUS['PROCESSING'])

        user = User.objects.filter(id=job.user.id).first()
        entity = Entity.objects.filter(id=job.target.id, is_active=True).first()
        if not entity or not user:
            # Abort when specified entity doesn't exist
            job.update(Job.STATUS['CANCELED'])
            return

        recv_data = json.loads(job.params)

        # register history to modify Entity
        history = user.seth_entity_add(entity)

        for attr in recv_data['attrs']:
            attr_base = EntityAttr.objects.create(name=attr['name'],
                                                  type=int(attr['type']),
                                                  is_mandatory=attr['is_mandatory'],
                                                  is_delete_in_chain=attr['is_delete_in_chain'],
                                                  created_user=user,
                                                  parent_entity=entity,
                                                  index=int(attr['row_index']))

            if int(attr['type']) & AttrTypeValue['object']:
                [attr_base.referral.add(Entity.objects.get(id=x)) for x in attr['ref_ids']]

            entity.attrs.add(attr_base)

            # register history to modify Entity
            history.add_attr(attr_base)

        # clear flag to specify this entity has been completed to create
        entity.del_status(Entity.STATUS_CREATING)

        # update job status and save it
        job.update(Job.STATUS['DONE'])


@app.task(bind=True)
def edit_entity(self, job_id):
    job = Job.objects.get(id=job_id)

    if job.proceed_if_ready():
        # At the first time, update job status to prevent executing this job duplicately
        job.update(Job.STATUS['PROCESSING'])

        user = User.objects.filter(id=job.user.id).first()
        entity = Entity.objects.filter(id=job.target.id, is_active=True).first()
        if not entity or not user:
            # Abort when specified entity doesn't exist
            job.update(Job.STATUS['CANCELED'])
            return

        recv_data = json.loads(job.params)

        # register history to modify Entity
        history = user.seth_entity_mod(entity)
        if entity.name != recv_data['name']:
            history.mod_entity(entity, 'old name: "%s"' % (entity.name))

        entity.name = recv_data['name']
        entity.note = recv_data['note']

        # update processing for each attrs
        for attr in recv_data['attrs']:
            if 'deleted' in attr:
                # In case of deleting attribute which has been already existed
                attr_obj = EntityAttr.objects.get(id=attr['id'])
                attr_obj.delete()

                # register History to register deleting EntityAttr
                history.del_attr(attr_obj)

            elif 'id' in attr and EntityAttr.objects.filter(id=attr['id']).exists():
                # In case of updating attribute which has been already existed
                attr_obj = EntityAttr.objects.get(id=attr['id'])

                # register operaion history if the parameters are changed
                if attr_obj.name != attr['name']:
                    history.mod_attr(attr_obj, 'old name: "%s"' % (attr_obj.name))

                if attr_obj.is_mandatory != attr['is_mandatory']:
                    if attr['is_mandatory']:
                        history.mod_attr(attr_obj, 'set mandatory flag')
                    else:
                        history.mod_attr(attr_obj, 'unset mandatory flag')

                params = {
                    'name': attr['name'],
                    'refs': [int(x) for x in attr['ref_ids']],
                    'index': attr['row_index'],
                    'is_mandatory': attr['is_mandatory'],
                    'is_delete_in_chain': attr['is_delete_in_chain'],
                }
                if attr_obj.is_updated(**params):
                    attr_obj.name = attr['name']
                    attr_obj.is_mandatory = attr['is_mandatory']
                    attr_obj.is_delete_in_chain = attr['is_delete_in_chain']
                    attr_obj.index = int(attr['row_index'])

                    # the case of an attribute that has referral entry
                    attr_obj.referral.clear()
                    if attr_obj.type & AttrTypeValue['object']:
                        [attr_obj.referral.add(Entity.objects.get(id=x)) for x in attr['ref_ids']]

                    attr_obj.save()

            else:
                # In case of creating new attribute
                attr_obj = EntityAttr.objects.create(name=attr['name'],
                                                     type=int(attr['type']),
                                                     is_mandatory=attr['is_mandatory'],
                                                     is_delete_in_chain=attr['is_delete_in_chain'],
                                                     index=int(attr['row_index']),
                                                     created_user=user,
                                                     parent_entity=entity)

                # append referral objects
                if int(attr['type']) & AttrTypeValue['object']:
                    [attr_obj.referral.add(Entity.objects.get(id=x)) for x in attr['ref_ids']]

                # add a new attribute on the existed Entries
                entity.attrs.add(attr_obj)

                # register History to register adding EntityAttr
                history.add_attr(attr_obj)

        # clear flag to specify this entity has been completed to edit
        entity.del_status(Entity.STATUS_EDITING)

        # update job status and save it
        job.update(Job.STATUS['DONE'])


@app.task(bind=True)
def delete_entity(self, job_id):
    job = Job.objects.get(id=job_id)

    if job.proceed_if_ready():
        # At the first time, update job status to prevent executing this job duplicately
        job.update(Job.STATUS['PROCESSING'])

        user = User.objects.filter(id=job.user.id).first()
        entity = Entity.objects.filter(id=job.target.id, is_active=False).first()
        if not entity or not user:
            # Abort when specified entity doesn't exist
            job.update(Job.STATUS['CANCELED'])
            return

        entity.delete()
        history = user.seth_entity_del(entity)

        # Delete all attributes which target Entity have
        for attr in entity.attrs.all():
            attr.delete()
            history.del_attr(attr)

        # update job status and save it
        job.update(Job.STATUS['DONE'])
