USE payment_service_db;

LOAD DATA INFILE '/var/lib/mysql-files/rhfd_payments.csv'
INTO TABLE rhfd_payments
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(payment_id, trip_id, amount, method, status, reference, created_at);