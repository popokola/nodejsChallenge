const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const uuid = require("uuid").v4;

exports.s3Uploadv3 = async (files) => {
  const s3client = new S3Client();

  const params = files.map((file) => {
    //get the file mimetype
    const mimetype = file.mimetype;
    return {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${uuid()}.${mimetype.split("/")[1]}`,
      Body: file.buffer,
    };
  });

  
  const uploadPromises = params.map((param) =>
    s3client.send(new PutObjectCommand(param))
  );

  const uploadResults = await Promise.all(uploadPromises);

  const publicUrls = uploadResults.map((result, index) => ({
    Location: `https://${ process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${params[index].Key}`,
    ETag: result.ETag,
    ServerSideEncryption: result.ServerSideEncryption,
  }));

  return publicUrls;

  /*
  return await Promise.all(
    params.map((param) => s3client.send(new PutObjectCommand(param)))
  );
  */
};