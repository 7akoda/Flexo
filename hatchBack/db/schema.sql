CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    user_id UUID NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    folder_id UUID,
    FOREIGN KEY (folder_id) REFERENCES folders(folder_id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_file_identity UNIQUE NULLS NOT DISTINCT (user_id, folder_id, file_name)
  );

CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username varchar(32) NOT NULL,
  UNIQUE (username),
  password_hash TEXT NOT NULL,
  avatar_url bytea,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE folders (
  folder_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folder_name varchar(255) NOT NULL,
  user_id UUID NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  parent_folder_id UUID,
  FOREIGN KEY (parent_folder_id) REFERENCES folders(folder_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOw(),
  CONSTRAINT unique_folder_identity UNIQUE NULLS NOT DISTINCT (user_id, parent_folder_id, folder_name)
);

