import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { Database } from 'firebase-admin/lib/database/database';

@Injectable()
export class FirebaseService {
  private realtimeDatabase: Database;
  constructor(private readonly configService: ConfigService) {
    admin.initializeApp({
      credential: admin.credential.cert('env/nestjs-a319f-firebase-adminsdk-gsqcc-02120d9722.json'),
      databaseURL: this.configService.get('FIREBASE_RTDB_URL'),
    });
    this.realtimeDatabase = admin.database();
  }

  /**
   *  path
   *  └── to
   *      └── save
   *          └── ...data
   */
  async set(path: string, data: any) {
    const ref = this.getRef(path);
    await ref.set(data, err => {
      if (err) console.log(err);
    });
  }

  /**
   *  path
   *  └── to
   *      └── save
   *          └── -OF6IqV0MXRqwXQliZCs
   *              └── ...data
   */
  async push(path: string, data: any) {
    const ref = this.getRef(path);
    await ref.push(data, err => {
      if (err) console.log(err);
    });
  }

  async update(path: string, data: any) {
    const ref = this.getRef(path);
    await ref.update(data, err => {
      if (err) console.log(err);
    });
  }

  async get(path: string) {
    const ref = this.getRef(path);
    return (await ref.get()).val();
  }

  async del(path: string) {
    const ref = this.getRef(path);
    await ref.remove(err => {
      if (err) console.log(err);
    });
  }

  private getRef(path: string) {
    path.replaceAll('//', '/');
    path = path.startsWith('/') ? path : '/' + path;
    return this.realtimeDatabase.ref(path);
  }
}
