# Requirements Document

## Introduction

マイページのファイル一覧において、現在表示されている「公開日」を「ダウンロード日時」に変更することで、ユーザーにとってより有用な情報を提供する機能改善を行います。この変更により、ユーザーはファイルがいつからダウンロード可能になるかを明確に把握できるようになります。

## Requirements

### Requirement 1

**User Story:** As a user, I want to see the download availability date instead of the publication date for files in my page, so that I can clearly understand when each file becomes downloadable.

#### Acceptance Criteria

1. WHEN ユーザーがマイページのファイル一覧を表示する THEN システムは各ファイルの「ダウンロード日時」を表示する SHALL
2. WHEN ファイルにdownloadable_atが設定されている THEN システムはその日時を「ダウンロード日時」として表示する SHALL
3. WHEN ファイルにdownloadable_atが設定されていない THEN システムは「未設定」と表示する SHALL
4. WHEN ダウンロード日時が未来の日付である THEN システムはその日時を表示し、ファイルがまだダウンロード不可であることを示す SHALL

### Requirement 2

**User Story:** As a user, I want the download date to be displayed in a consistent format, so that I can easily compare and understand the timing of different files.

#### Acceptance Criteria

1. WHEN ダウンロード日時が表示される THEN システムは「YYYY/MM/DD HH:mm」形式で表示する SHALL
2. WHEN ダウンロード日時が設定されていない THEN システムは「未設定」と表示する SHALL
3. WHEN 日時の表示エラーが発生した THEN システムは「-」を表示する SHALL

### Requirement 3

**User Story:** As a user, I want the column header to clearly indicate that it shows download dates, so that I understand what information is being displayed.

#### Acceptance Criteria

1. WHEN ファイル一覧のヘッダーが表示される THEN システムは「ダウンロード日時」というラベルを表示する SHALL
2. WHEN チームファイル一覧が表示される THEN ヘッダーは「ダウンロード日時」を含む SHALL
3. WHEN マッチファイル一覧が表示される THEN ヘッダーは「ダウンロード日時」を含む SHALL

### Requirement 4

**User Story:** As a user, I want the download date information to be accessible and properly labeled, so that screen readers and other assistive technologies can interpret the information correctly.

#### Acceptance Criteria

1. WHEN ダウンロード日時が表示される THEN システムは適切なaria-labelまたはtitle属性を提供する SHALL
2. WHEN 「未設定」が表示される THEN システムは適切なアクセシビリティ情報を提供する SHALL
3. WHEN テーブルヘッダーが表示される THEN システムは適切なscope属性を設定する SHALL
