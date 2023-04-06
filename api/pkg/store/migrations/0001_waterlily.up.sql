-- this is an artist that we feed the frontend with
-- and use to track training sessions
create table artist (
  -- the unique code we've given the artist in the contract
  -- we use their wallet address for this code
  -- so we can check if the contract has been paid for by the artist
  id varchar(255) primary key not null,
  created timestamp default current_timestamp,
  -- the bacalhau job id of the training job for the artists
  -- weights training job
  bacalhau_training_id varchar(255) not null default '',
  -- the state of the bacalhau job that is training this artist
  -- created - the artist exists in the database but we've not yet started training
  --           there is a window of time we allow between the form submission
  --           and when the artist must appear in the smart contract
  -- running - we've got a bacalhau job id and the job is running
  -- complete - we've completed the job with no error
  -- error - the job has errored
  bacalhau_state text check(bacalhau_state in ('created', 'running', 'complete', 'error')) not null default 'created',
  -- the state of us writing the result back to the contract
  -- none - we are waiting for the bacalhau job to complete
  -- complete - we have written the result back to the contract
  -- error - we have errored writing the result back to the contract
  contract_state text check(contract_state in ('none', 'complete', 'error')) not null default 'none',
  -- this is the JSON representation of the artists data
  data text not null
);


-- this is an image that a user has ordered to be generated
create table image (
  -- this comes from the smart contract and is the same ID
  id bigint primary key not null,
  created timestamp default current_timestamp,
  -- the ID of the bacalhau job for this image  
  bacalhau_inference_id varchar(255) not null default '',
  -- the state of the bacalhau job that is generating this image
  -- created - we know the contract_id but not the bacalhau_id
  -- running - we've got a bacalhau job id and the job is running
  -- complete - we've completed the job with no error
  -- error - the job has errored
  bacalhau_state text check(bacalhau_state in ('created', 'running', 'complete', 'error')) not null default 'created',
  -- the state of us writing the result back to the contract
  -- none - we are waiting for the bacalhau job to complete
  -- complete - we have written the result back to the contract
  -- error - we have errored writing the result back to the contract
  contract_state text check(contract_state in ('none', 'complete', 'error')) not null default 'none',
  -- details of what artist it is and the prompt
  artist_id varchar(255) not null,
  prompt text not null,
  FOREIGN KEY (artist_id) REFERENCES artist (id)
);
