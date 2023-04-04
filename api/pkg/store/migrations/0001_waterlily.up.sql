-- this is an image that a user has ordered to be generated
create table image (
  id integer primary key autoincrement,
  created timestamp default current_timestamp,
  contract_id bigint not null,
  bacalhau_inference_id varchar(255) not null,
  -- the state of the bacalhau job that is generating this image
  -- created - we know the contract_id but not the bacalhau_id
  -- running - we've got a bacalhau job id and the job is running
  -- complete - we've completed the job with no error
  -- error - the job has errored
  bacalhau_state text check(state in ('created', 'running', 'complete', 'error')) not null default 'created',
  -- the state of us writing the result back to the contract
  -- none - we are waiting for the bacalhau job to complete
  -- complete - we have written the result back to the contract
  -- error - we have errored writing the result back to the contract
  contract_state text check(state in ('none', 'complete', 'error')) not null default 'none',
);

-- this is an artist that we feed the frontend with
-- and use to track training sessions
create table artist (
  id integer primary key autoincrement,
  created timestamp default current_timestamp,
  -- the unique code we've given the artist in the contract
  -- we use their wallet address for this code
  -- so we can check if the contract has been paid for by the artist
  unique_code varchar(255) not null,
  -- the bacalhau job id of the training job for the artists
  -- weights training job
  bacalhau_training_id varchar(255) not null,
  -- the state of the bacalhau job that is training this artist
  -- created - we know the contract_id but not the bacalhau_id
  -- running - we've got a bacalhau job id and the job is running
  -- complete - we've completed the job with no error
  -- error - the job has errored
  bacalhau_state text check(state in ('created', 'running', 'complete', 'error')) not null default 'created',
  -- the state of us writing the result back to the contract
  -- none - we are waiting for the bacalhau job to complete
  -- complete - we have written the result back to the contract
  -- error - we have errored writing the result back to the contract
  contract_state text check(state in ('none', 'complete', 'error')) not null default 'none',
  -- this is the JSON representation of the artists data
  data text not null,
);

-- the example images that we display to the user
-- in this artists style
create table artist_image (
  id integer primary key autoincrement,
  created timestamp default current_timestamp,
  artist_id integer not null,
  bacalhau_inference_id varchar(255) not null,
  bacalhau_state text check(state in ('created', 'running', 'complete', 'error')) not null,
  FOREIGN KEY (artist_id) REFERENCES artist(id),
);

