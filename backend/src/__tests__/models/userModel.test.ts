import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../../models/userModel';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('User Model', () => {
  describe('signup', () => {
    const validUserData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'StrongP@ss123!',
      userType: 0,
    };

    it('should create a new user with valid data', async () => {
      const user = await User.signup(
        validUserData.name,
        validUserData.email,
        validUserData.password,
        validUserData.userType
      );

      expect(user).toBeDefined();
      expect(user.name).toBe(validUserData.name);
      expect(user.email).toBe(validUserData.email);
      expect(user.userType).toBe(validUserData.userType);
      expect(user.password).not.toBe(validUserData.password); // Should be hashed
    });

    it('should throw error for missing email', async () => {
      await expect(
        User.signup(validUserData.name, '', validUserData.password, validUserData.userType)
      ).rejects.toThrow('Email and password are required');
    });

    it('should throw error for missing password', async () => {
      await expect(
        User.signup(validUserData.name, validUserData.email, '', validUserData.userType)
      ).rejects.toThrow('Email and password are required');
    });

    it('should throw error for invalid email format', async () => {
      await expect(
        User.signup(validUserData.name, 'invalid-email', validUserData.password, validUserData.userType)
      ).rejects.toThrow('Email is not valid');
    });

    it('should throw error for weak password', async () => {
      await expect(
        User.signup(validUserData.name, validUserData.email, 'weak', validUserData.userType)
      ).rejects.toThrow('Password is not strong enough');
    });

    it('should throw error for duplicate email', async () => {
      await User.signup(
        validUserData.name,
        validUserData.email,
        validUserData.password,
        validUserData.userType
      );

      await expect(
        User.signup(validUserData.name, validUserData.email, validUserData.password, validUserData.userType)
      ).rejects.toThrow('Email already exists');
    });

    it('should create user with optional bio and profile picture', async () => {
      const user = await User.signup(
        validUserData.name,
        validUserData.email,
        validUserData.password,
        validUserData.userType,
        'Test bio',
        'http://example.com/pic.jpg'
      );

      expect(user.bio).toBe('Test bio');
      expect(user.profilePicture).toBe('http://example.com/pic.jpg');
    });
  });

  describe('login', () => {
    const userData = {
      name: 'Test User',
      email: 'login@example.com',
      password: 'StrongP@ss123!',
      userType: 0,
    };

    beforeEach(async () => {
      await User.signup(userData.name, userData.email, userData.password, userData.userType);
    });

    it('should login with valid credentials', async () => {
      const user = await User.login(userData.email, userData.password);

      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email);
    });

    it('should throw error for missing email', async () => {
      await expect(User.login('', userData.password)).rejects.toThrow(
        'Email and password are required'
      );
    });

    it('should throw error for missing password', async () => {
      await expect(User.login(userData.email, '')).rejects.toThrow(
        'Email and password are required'
      );
    });

    it('should throw error for invalid email format', async () => {
      await expect(User.login('invalid-email', userData.password)).rejects.toThrow(
        'Email is not valid'
      );
    });

    it('should throw error for non-existent email', async () => {
      await expect(User.login('nonexistent@example.com', userData.password)).rejects.toThrow(
        'Email does not exist'
      );
    });

    it('should throw error for incorrect password', async () => {
      await expect(User.login(userData.email, 'WrongP@ss123!')).rejects.toThrow(
        'Password is incorrect'
      );
    });
  });

  describe('schema defaults', () => {
    it('should set default values for optional fields', async () => {
      const user = await User.signup('Test', 'default@example.com', 'StrongP@ss123!', 0);

      expect(user.recipes).toEqual([]);
      expect(user.favorites).toEqual([]);
      expect(user.books).toEqual([]);
      expect(user.likes).toBe(0);
      expect(user.watches).toBe(0);
      expect(user.bio).toBe('');
      expect(user.profilePicture).toBe('');
    });
  });
});
