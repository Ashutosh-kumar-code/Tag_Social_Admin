import AWS from "aws-sdk";
import {
  aws_access_key_id,
  aws_secret_access_key,
  bucketName,
  hostname,
  folderStructurePath,
} from "./config";
import axios from "axios";
import { useDispatch } from "react-redux";
import { UPLOAD_FILE_AWS } from "../Component/store/dialogue/dialogue.type";

export const uploadFile = async (
  FileName,
  folderStructure,
  dispatch,
  loaderType
) => {
  try {
    const formData = new FormData();
    formData.append(
      "folderStructure",
      folderStructurePath + "/" + folderStructure
    );
    formData.append("keyName", FileName?.name);
    formData.append("content", FileName);
    const response = await axios.post(`admin/file/upload-file`, formData, {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        dispatch &&
          dispatch({
            type: UPLOAD_FILE_AWS,
            payload: {
              uploadFilePercent: percentCompleted,
              loaderType: loaderType,
            },
          });
      },
    });
    const resDataUrl = response.data.url;
    const spaceEndpoint = new AWS.Endpoint(`${hostname}`);

    const fileName =
      folderStructurePath + "/" + folderStructure + "/" + FileName?.name;
    const s3 = new AWS.S3({
      endpoint: spaceEndpoint,
      accessKeyId: aws_access_key_id,
      secretAccessKey: aws_secret_access_key,
    });

    const params = {
      Bucket: bucketName,
      Key: fileName,
      Expires: 60,
    };

    const imageURL = await new Promise((resolve, reject) => {
      s3.getSignedUrl("getObject", params, (err, url) => {
        if (err) {
          console.error("Error generating presigned URL:", err);
          reject(err);
          return;
        }
        resolve(url);
      });
    });

    return { resDataUrl, imageURL };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const covertURl = async (FileName) => {
  try {
    const spaceEndpoint = new AWS.Endpoint(`${hostname}`);

    const s3 = new AWS.S3({
      endpoint: spaceEndpoint,
      accessKeyId: aws_access_key_id,
      secretAccessKey: aws_secret_access_key,
    });

    const params = {
      Bucket: bucketName,
      Key: folderStructurePath + "/" + FileName,
      Expires: 100,
    };

    const imageURL = await new Promise((resolve, reject) => {
      s3.getSignedUrl("getObject", params, (err, url) => {
        if (err) {
          console.error("Error generating presigned URL:", err);
          reject(err);
          return;
        }
        resolve(url);
      });
    });

    return { FileName, imageURL };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
