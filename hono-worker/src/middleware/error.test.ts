import { HTTPException } from 'hono/http-exception';
import { describe, expect, it } from 'vitest';
import { createHttpErrorResponse } from './error';

describe('createHttpErrorResponse', () => {
    it('バリデーションエラーのfield errorsだけをdetailsとして返す', async () => {
        const response = createHttpErrorResponse(
            new HTTPException(400, {
                message: 'Validation failed',
                cause: {
                    name: ['Name is required'],
                    deadline: ['Invalid datetime'],
                },
            })
        );

        expect(response).toEqual({
            error: {
                message: 'Validation failed',
                code: 'HTTP_400',
                details: {
                    name: ['Name is required'],
                    deadline: ['Invalid datetime'],
                },
            },
        });
    });

    it('汎用causeは内部情報漏洩防止のためdetailsに返さない', async () => {
        const response = createHttpErrorResponse(
            new HTTPException(500, {
                message: 'Database failed',
                cause: new Error('select * from secret_table failed'),
            })
        );

        expect(response).toEqual({
            error: {
                message: 'Database failed',
                code: 'HTTP_500',
            },
        });
        expect(response.error.details).toBeUndefined();
    });

    it('field errors以外のobject causeもdetailsに返さない', async () => {
        const response = createHttpErrorResponse(
            new HTTPException(400, {
                message: 'Invalid token',
                cause: { code: 'INVALID_TOKEN' },
            })
        );

        expect(response).toEqual({
            error: {
                message: 'Invalid token',
                code: 'HTTP_400',
            },
        });
        expect(response.error.details).toBeUndefined();
    });
});
