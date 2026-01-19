// Discord Modal定義
import {
    ComponentType,
    TextInputStyle,
    InteractionResponseType,
    type InteractionResponse,
    type ActionRowComponent,
    type TextInputComponent,
} from '../../types/discord';

// Modal Custom IDs
export const MODAL_IDS = {
    EVENT_REGISTRATION: 'event_registration_modal',
} as const;

// Field Custom IDs
export const FIELD_IDS = {
    EVENT_NAME: 'event_name',
    EVENT_DETAILS: 'event_details',
    EVENT_DEADLINE: 'event_deadline',
    EVENT_DISPLAY_END: 'event_display_end',
} as const;

/**
 * イベント登録用Modalを生成
 */
export function createEventRegistrationModal(): InteractionResponse {
    const nameInput: TextInputComponent = {
        type: ComponentType.TEXT_INPUT,
        custom_id: FIELD_IDS.EVENT_NAME,
        style: TextInputStyle.SHORT,
        label: '大会名',
        min_length: 1,
        max_length: 100,
        required: true,
        placeholder: '例: 第10回 Europa杯',
    };

    const detailsInput: TextInputComponent = {
        type: ComponentType.TEXT_INPUT,
        custom_id: FIELD_IDS.EVENT_DETAILS,
        style: TextInputStyle.PARAGRAPH,
        label: '詳細',
        min_length: 1,
        max_length: 1000,
        required: true,
        placeholder: '大会の詳細情報を入力してください',
    };

    const deadlineInput: TextInputComponent = {
        type: ComponentType.TEXT_INPUT,
        custom_id: FIELD_IDS.EVENT_DEADLINE,
        style: TextInputStyle.SHORT,
        label: '締切日 (YYYY-MM-DD)',
        min_length: 10,
        max_length: 10,
        required: true,
        placeholder: '例: 2025-12-31',
    };

    const displayEndInput: TextInputComponent = {
        type: ComponentType.TEXT_INPUT,
        custom_id: FIELD_IDS.EVENT_DISPLAY_END,
        style: TextInputStyle.SHORT,
        label: '表示最終日 (YYYY-MM-DD)',
        min_length: 10,
        max_length: 10,
        required: true,
        placeholder: '例: 2026-01-15',
    };

    // 各フィールドをActionRowで囲む（Modalの仕様）
    const components: ActionRowComponent[] = [
        { type: ComponentType.ACTION_ROW, components: [nameInput] },
        { type: ComponentType.ACTION_ROW, components: [detailsInput] },
        { type: ComponentType.ACTION_ROW, components: [deadlineInput] },
        { type: ComponentType.ACTION_ROW, components: [displayEndInput] },
    ];

    return {
        type: InteractionResponseType.MODAL,
        data: {
            title: '大会登録',
            custom_id: MODAL_IDS.EVENT_REGISTRATION,
            components,
        },
    };
}

/**
 * Modal送信データからフィールド値を抽出
 */
export interface EventRegistrationFormData {
    eventName: string;
    eventDetails: string;
    eventDeadline: string;
    eventDisplayEnd: string;
}

export function extractModalValues(
    components: Array<{ type: number; components: Array<{ custom_id: string; value: string }> }>
): EventRegistrationFormData {
    const values: Record<string, string> = {};

    for (const row of components) {
        for (const component of row.components) {
            values[component.custom_id] = component.value;
        }
    }

    return {
        eventName: values[FIELD_IDS.EVENT_NAME] || '',
        eventDetails: values[FIELD_IDS.EVENT_DETAILS] || '',
        eventDeadline: values[FIELD_IDS.EVENT_DEADLINE] || '',
        eventDisplayEnd: values[FIELD_IDS.EVENT_DISPLAY_END] || '',
    };
}

/**
 * 日付形式のバリデーション (YYYY-MM-DD)
 */
export function isValidDateFormat(dateStr: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr)) return false;

    const date = new Date(dateStr);
    return !isNaN(date.getTime());
}

/**
 * フォームデータのバリデーション
 */
export interface ValidationResult {
    valid: boolean;
    errors: string[];
}

export function validateEventFormData(data: EventRegistrationFormData): ValidationResult {
    const errors: string[] = [];

    if (!data.eventName || data.eventName.length < 1) {
        errors.push('大会名は必須です');
    }
    if (data.eventName && data.eventName.length > 100) {
        errors.push('大会名は100文字以内で入力してください');
    }

    if (!data.eventDetails || data.eventDetails.length < 1) {
        errors.push('詳細は必須です');
    }
    if (data.eventDetails && data.eventDetails.length > 1000) {
        errors.push('詳細は1000文字以内で入力してください');
    }

    if (!isValidDateFormat(data.eventDeadline)) {
        errors.push('締切日はYYYY-MM-DD形式で入力してください');
    }

    if (!isValidDateFormat(data.eventDisplayEnd)) {
        errors.push('表示最終日はYYYY-MM-DD形式で入力してください');
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}
