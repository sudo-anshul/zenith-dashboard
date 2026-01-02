-- Create Profiles table (automatically handles new users via triggers if desired, but for now we rely on auth.users)

-- TASKS TABLE
create table tasks (
  id uuid primary key,
  user_id uuid references auth.users not null,
  text text,
  is_completed boolean default false,
  created_at bigint, -- Storing timestamp as number to match existing AppData
  type text, -- 'task' | 'habit'
  completion_history jsonb -- Array of dates for habits
);

alter table tasks enable row level security;

create policy "Users can view their own tasks"
  on tasks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own tasks"
  on tasks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own tasks"
  on tasks for update
  using (auth.uid() = user_id);

create policy "Users can delete their own tasks"
  on tasks for delete
  using (auth.uid() = user_id);


-- JOURNAL ENTRIES TABLE
create table journal_entries (
  id uuid primary key,
  user_id uuid references auth.users not null,
  date text, -- 'YYYY-MM-DD'
  content text,
  last_updated bigint,
  type text, -- 'daily' | 'weekly' | 'monthly' | 'freeform'
  questions jsonb -- Array of QA objects
);

alter table journal_entries enable row level security;

create policy "Users can view their own journal entries"
  on journal_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert their own journal entries"
  on journal_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own journal entries"
  on journal_entries for update
  using (auth.uid() = user_id);

create policy "Users can delete their own journal entries"
  on journal_entries for delete
  using (auth.uid() = user_id);
