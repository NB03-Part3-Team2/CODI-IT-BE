import express from 'express';
import inquiryController from '@modules/inquiry/inquiryController';
import inquiryValidator from '@modules/inquiry/inquiryValidator';
import { authMiddleware } from '@middlewares/authMiddleware';

const inquiryRouter = express.Router();

inquiryRouter
  .route('/:inquiryId')
  .get(inquiryValidator.validateGetInquiry, inquiryController.getInquiry);

inquiryRouter
  .route('/')
  .get(
    authMiddleware,
    inquiryValidator.validateGetMyInquiryList,
    inquiryController.getMyInquiryList,
  );

export default inquiryRouter;
