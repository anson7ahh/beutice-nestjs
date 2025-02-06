import { MongoConfig } from './mongo.config';

describe('MongoConfig', () => {
  it('should be defined', () => {
    expect(new MongoConfig()).toBeDefined();
  });
});
