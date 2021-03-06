-- This
-- is schema
-- example
DROP DATABASE IF EXISTS codename_ida;
CREATE DATABASE codename_ida;

\c codename_ida;

DROP TABLE IF EXISTS participants;
DROP TABLE IF EXISTS liked_itineraries;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS activities;
DROP TABLE IF EXISTS itineraries;
DROP TABLE IF EXISTS users;


CREATE TABLE users
(
  id VARCHAR PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email VARCHAR NOT NULL,
  password VARCHAR NOT NULL,
  phone BIGINT DEFAULT 9999999999,
  location VARCHAR NOT NULL DEFAULT ' ',
  profile_pic VARCHAR NOT NULL DEFAULT ' '
);

CREATE TABLE itineraries
(
  id SERIAL PRIMARY KEY,
  user_id VARCHAR REFERENCES users(id) ON DELETE CASCADE,
  time_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  itinerary_date DATE NOT NULL,
  itinerary_StartTime TIME,
  title VARCHAR NOT NULL DEFAULT 'Your Itinerary',
  itin_pic VARCHAR NOT NULL DEFAULT ' ',
  private BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE TABLE activities
(
  id VARCHAR PRIMARY KEY,
  itin_id INT REFERENCES itineraries(id) ON DELETE CASCADE,
  location VARCHAR ,
  longitude VARCHAR ,
  latitude VARCHAR ,
  activity_name VARCHAR ,
  category VARCHAR ,
  image VARCHAR,
  activity_StartTime VARCHAR ,
  activity_EndTime VARCHAR,
  duration VARCHAR
);
CREATE TABLE liked_itineraries
(
  id SERIAL PRIMARY KEY,
  user_id VARCHAR REFERENCES users(id) ON DELETE CASCADE,
  itin_id INT REFERENCES itineraries(id) ON DELETE CASCADE
);
CREATE TABLE comments
(
  id SERIAL PRIMARY KEY,
  user_id VARCHAR REFERENCES users(id) ON DELETE CASCADE,
  itin_id INT REFERENCES itineraries(id) ON DELETE CASCADE,
  body varchar,
  time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE participants
(
  id SERIAL PRIMARY KEY,
  user_id VARCHAR REFERENCES users(id) ON DELETE CASCADE,
  itin_id INT REFERENCES itineraries(id) ON DELETE CASCADE
);

-- SEED DATA

INSERT INTO users
  (id, first_name, last_name, email, password, phone, location)
VALUES
  ('LBV0TgefmFRxpIiqhhUQvPbzdEi2', 'Brandon', 'Brown', 'brandonbrown@pursuit.org', 'a', 6466205446, 'Brooklyn, NY');
-- ('Dugmar', 'Morocho', 'dugmarmorocho@pursuit.org', '1234abcd', 8003934448, 'Queens, NY'),
-- ('Brandon', 'Brown', 'brandonbrown@pursuit.org', 'password1', 8775277454, 'Brooklyn, NY'),
-- ('Rafid', 'Hossain', 'rafidhossain@pursuit.org', '1password', 8008888888, 'Queens, NY')
-- ;

INSERT INTO itineraries
  (user_id, itinerary_date, title)
-- VALUES (1, '2020-08-30', 'My One Year Anniversary'),
-- (1, '2020-08-21', 'Mom''s Birthday Agenda'),
-- (2, '2020=07-28', 'Date Night'),
-- (3, '2020-09-10', 'Litty Weekend'),
-- (4, '2020-11-11', 'Pop the Question'),
VALUES
  ('LBV0TgefmFRxpIiqhhUQvPbzdEi2', '2020-08-30', 'brunch'),
  ('LBV0TgefmFRxpIiqhhUQvPbzdEi2', '2020-08-30', 'birthday dinner'),
  ('LBV0TgefmFRxpIiqhhUQvPbzdEi2', '2020-08-30', 'Anni');

-- INSERT INTO activities (itin_id, location, activity_name, category)
-- VALUES (1, 'Harlem, NY', 'Harlem Hookah', 'Bars'),
-- (2, 'New York, NY', 'Lion King', 'Theatres'),
-- (3, 'New York, NY', 'Mama Sushi', 'Bars'),
-- (4, 'Brooklyn, NY


-- INSERT INTO liked_itineraries (user_id, itin_id)
-- VALUES (1,2),
-- (2,1),
-- (3,4),
-- (4,3);

-- INSERT INTO comments (user_id, itin_id, body)
-- VALUES (1, 2, 'Double date vibes'),
-- (2, 1, 'Congrats man she''ll love it'),
-- (3, 4, 'My boy doing big things!'),
-- (4, 3, 'Oh we getting lit lit!');

-- INSERT INTO participants (user_id, itin_id)
-- VALUES (1,2),
-- (2,1),
-- (3,4),
-- (4,3);
