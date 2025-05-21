<?php

namespace App\Filament\Resources;

use App\Filament\Resources\FileResource\Pages;
use App\Filament\Resources\FileResource\RelationManagers;
use App\File;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class FileResource extends Resource
{
    protected static ?string $model = File::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
              Forms\Components\Select::make('upload_user_id')
                ->relationship('user', 'name')
                ->label('アップロードユーザー')
                ->required(),

              Forms\Components\TextInput::make('upload_owner_name')
                ->label('アップロード者名')
                ->required(),

              Forms\Components\TextInput::make('file_name')
                ->label('ファイル名')
                ->required(),

              Forms\Components\Textarea::make('file_comment')
                ->label('ファイルコメント'),

              Forms\Components\TextInput::make('upload_type')
                ->label('アップロードタイプ'),

              Forms\Components\TextInput::make('data_type')
                ->label('データタイプ'),

              Forms\Components\TextInput::make('search_tag1')
                ->label('検索タグ1'),

              Forms\Components\TextInput::make('search_tag2')
                ->label('検索タグ2'),

              Forms\Components\TextInput::make('search_tag3')
                ->label('検索タグ3'),

              Forms\Components\TextInput::make('search_tag4')
                ->label('検索タグ4'),

              Forms\Components\DateTimePicker::make('downloadable_at')
                ->label('ダウンロード可能日時'),

              // Explicitly exclude file_data field
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
              Tables\Columns\TextColumn::make('user.name')
                ->label('アップロードユーザー名')
                ->sortable()
                ->searchable(),

              Tables\Columns\TextColumn::make('upload_owner_name')
                ->searchable(),
              Tables\Columns\TextColumn::make('file_name')
                ->searchable(),
              Tables\Columns\TextColumn::make('file_comment')
                ->searchable(),
              Tables\Columns\TextColumn::make('upload_type')
                ->label('アップロード種別')
                ->formatStateUsing(fn ($state) => [
                  '1' => '通常アップロード',
                  '2' => 'ログインなし簡易アップロード',
                ][$state] ?? '不明'),

              // データ種別（ラベル化）
              Tables\Columns\TextColumn::make('data_type')
                ->label('データ種別')
                ->formatStateUsing(fn ($state) => [
                  '1' => 'チーム',
                  '2' => 'マッチ',
                ][$state] ?? '不明'),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListFiles::route('/'),
            'create' => Pages\CreateFile::route('/create'),
            'edit' => Pages\EditFile::route('/{record}/edit'),
        ];
    }
}
