const { S3Client, PutObjectCommand, DeleteObjectCommand} = require("@aws-sdk/client-s3");
const uuid = require("uuid").v4;
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer");
const { CloudFrontClient, CreateInvalidationCommand } = require("@aws-sdk/client-cloudfront");

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
        url: `https://d20qjuy7xukb2n.cloudfront.net/uploads/${params[index].Key}`,
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


exports.s3Delete = async (key) => {
  try {
    const s3client = new S3Client();

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: "uploads/" + key,
    };

    //invalidate cloudfront cache
    const cloudfront = new CloudFrontClient({ 
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const cloudfrontParams = {
      DistributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID,
      InvalidationBatch: {
        CallerReference: `/uploads/${key}`,
        Paths: {
          Quantity: 1,
          Items: [`/uploads/${key}`],
        },
      },
    };

    await cloudfront.send(new CreateInvalidationCommand(cloudfrontParams));

    await s3client.send(new DeleteObjectCommand(params));

    return { status: "success" };
  }
  catch (err) {
    console.log(err);
  }
}

exports.s3GetSignedUrl = async (key) => {
  try {
    const url = getSignedUrl({
      url: `https://d20qjuy7xukb2n.cloudfront.net/uploads/${key}`,
      method: "GET",
      dateLessThan: new Date(Date.now() + 60 * 60 * 1000), // the URL will expire after 1 hour
      privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
      keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
    });
    console.log(url);
    return url;
  } catch (err) {
    console.log(err);
  }
}