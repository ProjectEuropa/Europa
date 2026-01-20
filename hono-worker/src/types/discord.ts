// Discord API 型定義

// Interaction Types
export const InteractionType = {
    PING: 1,
    APPLICATION_COMMAND: 2,
    MESSAGE_COMPONENT: 3,
    APPLICATION_COMMAND_AUTOCOMPLETE: 4,
    MODAL_SUBMIT: 5,
} as const;

export type InteractionTypeValue = (typeof InteractionType)[keyof typeof InteractionType];

// Interaction Response Types
export const InteractionResponseType = {
    PONG: 1,
    CHANNEL_MESSAGE_WITH_SOURCE: 4,
    DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE: 5,
    DEFERRED_UPDATE_MESSAGE: 6,
    UPDATE_MESSAGE: 7,
    APPLICATION_COMMAND_AUTOCOMPLETE_RESULT: 8,
    MODAL: 9,
} as const;

export type InteractionResponseTypeValue =
    (typeof InteractionResponseType)[keyof typeof InteractionResponseType];

// Component Types
export const ComponentType = {
    ACTION_ROW: 1,
    BUTTON: 2,
    STRING_SELECT: 3,
    TEXT_INPUT: 4,
    USER_SELECT: 5,
    ROLE_SELECT: 6,
    MENTIONABLE_SELECT: 7,
    CHANNEL_SELECT: 8,
} as const;

// Text Input Styles
export const TextInputStyle = {
    SHORT: 1,
    PARAGRAPH: 2,
} as const;

// Application Command Types
export const ApplicationCommandType = {
    CHAT_INPUT: 1,
    USER: 2,
    MESSAGE: 3,
} as const;

// Discord User
export interface DiscordUser {
    id: string;
    username: string;
    discriminator: string;
    avatar: string | null;
    global_name?: string | null;
}

// Discord Member
export interface DiscordMember {
    user?: DiscordUser;
    nick?: string | null;
    roles: string[];
    joined_at: string;
}

// Interaction Data (for APPLICATION_COMMAND)
export interface ApplicationCommandInteractionData {
    id: string;
    name: string;
    type: number;
    options?: ApplicationCommandOption[];
}

export interface ApplicationCommandOption {
    name: string;
    type: number;
    value?: string | number | boolean;
    options?: ApplicationCommandOption[];
}

// Modal Submit Data
export interface ModalSubmitInteractionData {
    custom_id: string;
    components: ModalSubmitComponent[];
}

export interface ModalSubmitComponent {
    type: number;
    components: ModalSubmitTextInput[];
}

export interface ModalSubmitTextInput {
    type: number;
    custom_id: string;
    value: string;
}

// Discord Interaction (incoming request)
export interface DiscordInteraction {
    id: string;
    application_id: string;
    type: InteractionTypeValue;
    data?: ApplicationCommandInteractionData | ModalSubmitInteractionData;
    guild_id?: string;
    channel_id?: string;
    member?: DiscordMember;
    user?: DiscordUser;
    token: string;
    version: number;
}

// Text Input Component
export interface TextInputComponent {
    type: typeof ComponentType.TEXT_INPUT;
    custom_id: string;
    style: number;
    label: string;
    min_length?: number;
    max_length?: number;
    required?: boolean;
    value?: string;
    placeholder?: string;
}

// Action Row Component
export interface ActionRowComponent {
    type: typeof ComponentType.ACTION_ROW;
    components: TextInputComponent[];
}

// Modal Data
export interface ModalData {
    title: string;
    custom_id: string;
    components: ActionRowComponent[];
}

// Interaction Response
export interface InteractionResponse {
    type: InteractionResponseTypeValue;
    data?: InteractionResponseData;
}

export interface InteractionResponseData {
    content?: string;
    embeds?: DiscordEmbed[];
    flags?: number;
    components?: ActionRowComponent[];
    // Modal specific
    title?: string;
    custom_id?: string;
}

// Discord Embed
export interface DiscordEmbed {
    title?: string;
    description?: string;
    url?: string;
    timestamp?: string;
    color?: number;
    footer?: {
        text: string;
        icon_url?: string;
    };
    author?: {
        name: string;
        url?: string;
        icon_url?: string;
    };
    fields?: DiscordEmbedField[];
}

export interface DiscordEmbedField {
    name: string;
    value: string;
    inline?: boolean;
}

// Discord Message (for REST API)
export interface DiscordMessage {
    id: string;
    channel_id: string;
    content: string;
    embeds?: DiscordEmbed[];
    timestamp: string;
}

// Create Message Request
export interface CreateMessageRequest {
    content?: string;
    embeds?: DiscordEmbed[];
}

// Message Flags
export const MESSAGE_FLAGS = {
    CROSSPOSTED: 1 << 0,
    IS_CROSSPOST: 1 << 1,
    SUPPRESS_EMBEDS: 1 << 2,
    SOURCE_MESSAGE_DELETED: 1 << 3,
    URGENT: 1 << 4,
    HAS_THREAD: 1 << 5,
    EPHEMERAL: 1 << 6,
    LOADING: 1 << 7,
} as const;

// Event Types
export const EVENT_TYPES = {
    TOURNAMENT: '1',
    ANNOUNCEMENT: '2',
} as const;
