<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EventNoticeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'eventName' => 'required|max:20',
            'eventDetails' => 'required|max:200',
            'eventClosingDate' => 'required|date_format:Y-m-d',
            'eventClosingTime' => 'required|date_format:H:i',
            'eventDisplayingDate' => 'required|date_format:Y-m-d',
            'eventDisplayingTime' => 'required|date_format:H:i',
        ];
    }
}
