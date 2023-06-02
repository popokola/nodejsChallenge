const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const uuid = require("uuid").v4;
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer");

exports.s3Uploadv3 = async (files) => {
  const s3client = new S3Client();

  const params = files.map((file) => {
    //get the file mimetype
    const mimetype = file.mimetype;
    return {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${uuid()}.${mimetype.split("/")[1]}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
  });

  
  const uploadPromises = params.map((param) =>
    s3client.send(new PutObjectCommand(param))
  );

  const uploadResults = await Promise.all(uploadPromises);

  try {
    const publicUrls = uploadResults.map((result, index) => ({
      Location: getSignedUrl({
        url: `https://d20qjuy7xukb2n.cloudfront.net/${params[index].Key}`,
        method: "GET",
        dateLessThan: new Date(Date.now() + 60 * 60 * 1000), // the URL will expire after 1 hour
        privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
        keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
      }),
      ETag: result.ETag,
      ServerSideEncryption: result.ServerSideEncryption,
    }));

    return publicUrls;
  } catch (error) {
    console.log(error);
  }

  /*
  return await Promise.all(
    params.map((param) => s3client.send(new PutObjectCommand(param)))
  );
  */
};