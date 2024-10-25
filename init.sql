CREATE EXTENSION IF NOT EXISTS dblink;

DO $$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'access_doc') THEN
      PERFORM dblink_exec('dbname=postgres', 'CREATE DATABASE access_doc');
   END IF;
END $$;

-- Crear la base de datos 'chatbot' si no existe
DO $$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'chatbot') THEN
      PERFORM dblink_exec('dbname=postgres', 'CREATE DATABASE chatbot');
   END IF;
END $$;