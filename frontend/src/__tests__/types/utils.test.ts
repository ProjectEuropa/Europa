import { describe, expect, it } from 'vitest';
import type {
  DateString,
  DeepPartial,
  DeepReadonly,
  EnvironmentVariables,
  ID,
  LoadingState,
  Optional,
  Rename,
  RequiredFields,
  SnakeToCamel,
  SnakeToCamelObject,
  TimeString,
} from '@/types/utils';

describe('Utils Types', () => {
  describe('Optional', () => {
    interface TestInterface {
      id: number;
      name: string;
      email: string;
    }

    it('should make specified properties optional', () => {
      type OptionalEmail = Optional<TestInterface, 'email'>;

      const validObject: OptionalEmail = {
        id: 1,
        name: 'Test User',
        // email is optional
      };

      const validObjectWithEmail: OptionalEmail = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
      };

      expect(validObject.id).toBe(1);
      expect(validObject.name).toBe('Test User');
      expect(validObjectWithEmail.email).toBe('test@example.com');
    });

    it('should make multiple properties optional', () => {
      type OptionalNameAndEmail = Optional<TestInterface, 'name' | 'email'>;

      const minimalObject: OptionalNameAndEmail = {
        id: 1,
        // name and email are optional
      };

      expect(minimalObject.id).toBe(1);
    });
  });

  describe('RequiredFields', () => {
    interface PartialInterface {
      id?: number;
      name?: string;
      email?: string;
    }

    it('should make specified properties required', () => {
      type RequiredId = RequiredFields<PartialInterface, 'id'>;

      const validObject: RequiredId = {
        id: 1, // now required
        name: 'Test User',
      };

      expect(validObject.id).toBe(1);
    });
  });

  describe('DeepPartial', () => {
    interface NestedInterface {
      user: {
        id: number;
        profile: {
          name: string;
          age: number;
        };
      };
      settings: {
        theme: string;
        notifications: boolean;
      };
    }

    it('should make all properties recursively optional', () => {
      const partialObject: DeepPartial<NestedInterface> = {
        user: {
          profile: {
            name: 'Test',
            // age is optional
          },
          // id is optional
        },
        // settings is optional
      };

      expect(partialObject.user?.profile?.name).toBe('Test');
    });
  });

  describe('DeepReadonly', () => {
    interface MutableInterface {
      data: {
        items: string[];
        count: number;
      };
    }

    it('should make all properties recursively readonly', () => {
      const readonlyObject: DeepReadonly<MutableInterface> = {
        data: {
          items: ['item1', 'item2'],
          count: 2,
        },
      };

      expect(readonlyObject.data.items).toEqual(['item1', 'item2']);
      expect(readonlyObject.data.count).toBe(2);
    });
  });

  describe('Rename', () => {
    interface OriginalInterface {
      oldName: string;
      value: number;
    }

    it('should rename specified property', () => {
      type RenamedInterface = Rename<OriginalInterface, 'oldName', 'newName'>;

      const renamedObject: RenamedInterface = {
        newName: 'test', // renamed from oldName
        value: 42,
      };

      expect(renamedObject.newName).toBe('test');
      expect(renamedObject.value).toBe(42);
    });
  });

  describe('SnakeToCamel', () => {
    it('should convert snake_case to camelCase', () => {
      type CamelCase1 = SnakeToCamel<'user_name'>;
      type CamelCase2 = SnakeToCamel<'api_base_url'>;
      type CamelCase3 = SnakeToCamel<'created_at_time'>;

      // These are compile-time tests, we verify the types work
      const test1: CamelCase1 = 'userName';
      const test2: CamelCase2 = 'apiBaseUrl';
      const test3: CamelCase3 = 'createdAtTime';

      expect(test1).toBe('userName');
      expect(test2).toBe('apiBaseUrl');
      expect(test3).toBe('createdAtTime');
    });

    it('should handle strings without underscores', () => {
      type NoChange = SnakeToCamel<'simple'>;

      const test: NoChange = 'simple';
      expect(test).toBe('simple');
    });
  });

  describe('SnakeToCamelObject', () => {
    interface SnakeInterface {
      user_id: number;
      user_name: string;
      created_at: string;
      user_profile: {
        first_name: string;
        last_name: string;
      };
    }

    it('should convert object keys from snake_case to camelCase', () => {
      type CamelObject = SnakeToCamelObject<SnakeInterface>;

      // This is a compile-time test to ensure the type transformation works
      const camelObject = {
        userId: 1,
        userName: 'test',
        createdAt: '2024-01-01',
        userProfile: {
          firstName: 'John',
          lastName: 'Doe',
        },
      } as CamelObject;

      expect(camelObject.userId).toBe(1);
      expect(camelObject.userName).toBe('test');
      expect(camelObject.userProfile.firstName).toBe('John');
    });
  });

  describe('DateString', () => {
    it('should accept ISO 8601 date strings', () => {
      const date1: DateString = '2024-01-15';
      const date2: DateString = '2024-12-31T23:59:59Z';
      const date3: DateString = '2024-06-15T10:30:00.000Z';

      expect(date1).toBe('2024-01-15');
      expect(date2).toBe('2024-12-31T23:59:59Z');
      expect(date3).toBe('2024-06-15T10:30:00.000Z');
    });
  });

  describe('TimeString', () => {
    it('should accept HH:mm format time strings', () => {
      const time1: TimeString = '09:30';
      const time2: TimeString = '23:59';
      const time3: TimeString = '00:00';

      expect(time1).toBe('09:30');
      expect(time2).toBe('23:59');
      expect(time3).toBe('00:00');
    });
  });

  describe('ID', () => {
    it('should accept both string and number IDs', () => {
      const stringId: ID = 'user-123';
      const numberId: ID = 456;

      expect(stringId).toBe('user-123');
      expect(numberId).toBe(456);
      expect(typeof stringId).toBe('string');
      expect(typeof numberId).toBe('number');
    });
  });

  describe('LoadingState', () => {
    it('should accept valid loading states', () => {
      const states: LoadingState[] = ['idle', 'loading', 'success', 'error'];

      states.forEach(state => {
        const loadingState: LoadingState = state;
        expect(['idle', 'loading', 'success', 'error']).toContain(loadingState);
      });
    });

    it('should work in state management scenarios', () => {
      let currentState: LoadingState = 'idle';

      currentState = 'loading';
      expect(currentState).toBe('loading');

      currentState = 'success';
      expect(currentState).toBe('success');

      currentState = 'error';
      expect(currentState).toBe('error');
    });
  });

  describe('EnvironmentVariables', () => {
    it('should define environment variable structure', () => {
      const env: EnvironmentVariables = {
        NEXT_PUBLIC_API_BASE_URL: 'https://api.example.com',
        NEXT_PUBLIC_BASIC_AUTH_USER: 'user',
        NEXT_PUBLIC_BASIC_AUTH_PASSWORD: 'password',
      };

      expect(env.NEXT_PUBLIC_API_BASE_URL).toBe('https://api.example.com');
      expect(env.NEXT_PUBLIC_BASIC_AUTH_USER).toBe('user');
      expect(env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD).toBe('password');
    });

    it('should work with required fields only', () => {
      const minimalEnv: EnvironmentVariables = {
        NEXT_PUBLIC_API_BASE_URL: 'https://api.example.com',
      };

      expect(minimalEnv.NEXT_PUBLIC_API_BASE_URL).toBe(
        'https://api.example.com'
      );
      expect(minimalEnv.NEXT_PUBLIC_BASIC_AUTH_USER).toBeUndefined();
      expect(minimalEnv.NEXT_PUBLIC_BASIC_AUTH_PASSWORD).toBeUndefined();
    });
  });

  describe('Type Utility Combinations', () => {
    interface ComplexInterface {
      id: number;
      name: string;
      email?: string;
      settings: {
        theme: string;
        notifications: boolean;
      };
    }

    it('should combine multiple utility types', () => {
      type OptionalIdAndReadonly = DeepReadonly<
        Optional<ComplexInterface, 'id'>
      >;

      const complexObject: OptionalIdAndReadonly = {
        name: 'Test User',
        settings: {
          theme: 'dark',
          notifications: true,
        },
      };

      expect(complexObject.name).toBe('Test User');
      expect(complexObject.settings.theme).toBe('dark');
    });
  });
});
