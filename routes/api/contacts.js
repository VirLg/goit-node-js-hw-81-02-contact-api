import { Router } from 'express';
import * as contactServises from '../../models/contacts.js';
// import * as controllersContact from '../../controlers/controllersContacts.js';
import controllersContact from '../../controlers/controllersContacts.js';
import { ctrlWrapper } from '../../helpers/ctrlWrapper.js';

const { getAll, getById, deleteById, add } = controllersContact;
const router = Router();

router.get('/', ctrlWrapper(getAll));

router.get('/:contactId', ctrlWrapper(getById));

router.delete('/:contactId', ctrlWrapper(deleteById));

router.post('/', ctrlWrapper(add));

router.put('/:contactId', async (req, res, next) => {
  res.json(await contactServises.updateContact(id, reg.body));
});

export default router;
