INSERT INTO user_credentials 
  (user_id, type)
VALUES 
  ((SELECT id FROM users WHERE first_name='Greg'), 'apple'),
  ((SELECT id FROM users WHERE first_name='Mary'), 'facebook'),
  ((SELECT id FROM users WHERE first_name='Mary'), 'apple'),
  ((SELECT id FROM users WHERE first_name='Mary'), 'username'),
  ((SELECT id FROM users WHERE first_name='Gerald'), 'username'),
  ((SELECT id FROM users WHERE first_name='Gerald'), 'facebook');