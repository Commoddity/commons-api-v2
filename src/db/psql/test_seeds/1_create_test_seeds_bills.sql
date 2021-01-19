INSERT INTO bills 
  (parliamentary_session_id, code, title, description, introduced_date, summary_url, page_url, full_text_url, passed)
VALUES 
  ((SELECT id FROM parliamentary_sessions ORDER BY created_at DESC LIMIT 1), 'C-420', 'A Bill to Save Baby Seals', 'Saving cute little baby seals', '2020/03/10', 'http://www.savetheseals.com', 'http://www.savesomeseals.com', 'http://www.saveaseal.com', null), 
  ((SELECT id FROM parliamentary_sessions ORDER BY created_at DESC LIMIT 1), 'C-829', 'A Bill to Climb a Tree', 'Climbing trees is lots of fun', '2020/10/10', 'http://www.climbthetrees.com', 'http://www.climbsometrees.com', 'http://www.climbatree.com', true), 
  ((SELECT id FROM parliamentary_sessions ORDER BY created_at DESC LIMIT 1), 'C-44', 'A Bill to Drive a Car', 'Driving all the time yay', '2019/12/07', 'http://www.drivethecars.com', 'http://www.drivesomecars.com', 'http://www.driveacar.com', false);
