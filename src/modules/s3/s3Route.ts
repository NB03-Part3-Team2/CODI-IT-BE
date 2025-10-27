import express from 'express';
import multer from 'multer';
import s3Controller from './s3Controller';
import s3Validator from './s3Validator';

const s3Router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

s3Router
  .route('/upload')
  .post(upload.single('image'), s3Validator.validateImageUpload, s3Controller.uploadImage);

export default s3Router;
