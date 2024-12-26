import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3BucketService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: configService.get('S3_REGION') ?? '',
      credentials: {
        accessKeyId: configService.get('S3_ACCESS_KEY') ?? '',
        secretAccessKey: configService.get('S3_SECRET_ACCESS_KEY') ?? '',
      },
    });
    this.bucketName = configService.get('S3_NAME') ?? '';
  }

  async createPresignedUrl(key: string, ttl?: number) {
    const command = new PutObjectCommand({ Bucket: this.bucketName, Key: key });
    return await getSignedUrl(this.s3Client, command, { expiresIn: ttl ?? 60 });
  }
}
