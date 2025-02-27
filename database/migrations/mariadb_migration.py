import mysql.connector
import argparse
import re
import time

def process_schema_sql_file(mariadb_conn, sql_file_path):
    """Citește un fișier SQL cu definiția schemei și îl execută în MariaDB, cu adaptări."""

    print(f"Procesarea fișierului SQL: {sql_file_path}")
    start_time = time.time()

    mariadb_cursor = mariadb_conn.cursor()
    mariadb_conn.autocommit = False  # Folosim tranzacții

    try:
        with open(sql_file_path, 'r', encoding='utf-8') as sql_file:
            current_statement = ""
            in_multi_line_comment = False

            for line in sql_file:
                line = line.strip()

                # Gestionarea comentariilor multi-linie
                if line.startswith("/*"):
                    in_multi_line_comment = True
                if in_multi_line_comment:
                    if "*/" in line:
                        in_multi_line_comment = False
                    continue

                if line.startswith("--") or not line:
                    continue

                current_statement += line + "\n"

                if line.endswith(";"):
                    # Adaptări SQL pentru MariaDB
                    current_statement = current_statement.replace("OWNER TO", "-- OWNER TO")
                    current_statement = current_statement.replace("CREATE EXTENSION", "-- CREATE EXTENSION")
                    current_statement = re.sub(r"SET search_path = .*?;", "", current_statement)
                    current_statement = re.sub(r"SELECT pg_catalog\.set_config\(.*?\);", "", current_statement)
                    current_statement = current_statement.replace("CREATE SEQUENCE", "CREATE TABLE IF NOT EXISTS sequence_temp_table")
                    current_statement = current_statement.replace("ALTER SEQUENCE", "-- ALTER SEQUENCE")
                    current_statement = re.sub(r"nextval\('(.*?)'\)", r"(SELECT auto_increment FROM information_schema.tables WHERE table_name = '\1')", current_statement, flags=re.IGNORECASE)
                    current_statement = current_statement.replace("bigint DEFAULT nextval", "bigint AUTO_INCREMENT")
                    current_statement = current_statement.replace("double precision", "DOUBLE")
                    current_statement = current_statement.replace("character varying", "VARCHAR")
                    current_statement = re.sub(r"timestamp(.*?)\(", r"timestamp(", current_statement)
                    current_statement = current_statement.replace("timestamptz", "TIMESTAMP") # Mapare timestamptz la TIMESTAMP (vezi mai jos)
                    current_statement = current_statement.replace("DEFAULT CURRENT_TIMESTAMP", "DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP") # Adaugat ON UPDATE pentru updated_at
                    current_statement = current_statement.replace("DEFAULT gen_random_uuid()", "DEFAULT (UUID())") #mapare functie de uuid
                    current_statement = current_statement.replace("jsonb", "JSON") #mapare jsonb in json
                    current_statement = re.sub(r"CREATE POLICY.*?;", "", current_statement) #Sterge RLS policies (sunt specifice postgres)
                    current_statement = re.sub(r"ALTER TABLE.*?ENABLE ROW LEVEL SECURITY;", "", current_statement) #sterge enable rls
                    

                    # Ignoră comenzi specifice PostgreSQL
                    if current_statement.startswith("SET ") or current_statement.startswith("SELECT pg_catalog."):
                        current_statement = ""
                        continue

                    if current_statement.strip():  # Execută doar dacă nu e goală
                        try:
                            mariadb_cursor.execute(current_statement)
                        except mysql.connector.Error as err:
                            print(f"Eroare la executarea SQL:\n{current_statement}\nEroare: {err}")
                            mariadb_conn.rollback()
                            return False  # Ieșire în caz de eroare

                    current_statement = ""

        mariadb_conn.commit()
        print(f"\nFișierul SQL a fost procesat și schema a fost creată în MariaDB în {time.time() - start_time:.2f} secunde.")
        return True

    except FileNotFoundError:
        print(f"Eroare: Fișierul SQL '{sql_file_path}' nu a fost găsit.")
        return False
    except mysql.connector.Error as err:
        print(f"Eroare generală: {err}")
        mariadb_conn.rollback()
        return False
    finally:
        if mariadb_cursor:
            mariadb_cursor.close()

def main():
    parser = argparse.ArgumentParser(description="Importă schema dintr-un fișier SQL în MariaDB.")
    parser.add_argument("--mariadb_host", required=True, help="Host MariaDB")
    parser.add_argument("--mariadb_port", type=int, default=3306, help="Port MariaDB (default: 3306)")
    parser.add_argument("--mariadb_db", required=True, help="Baza de date MariaDB")
    parser.add_argument("--mariadb_user", required=True, help="Utilizator MariaDB")
    parser.add_argument("--mariadb_password", required=True, help="Parola MariaDB")
    parser.add_argument("--sql_file", required=True, help="Calea către fișierul SQL de importat")

    args = parser.parse_args()

    mariadb_config = {
        'host': args.mariadb_host,
        'port': args.mariadb_port,
        'database': args.mariadb_db,
        'user': args.mariadb_user,
        'password': args.mariadb_password,
        'autocommit': False
    }

    mariadb_conn = None
    try:
        mariadb_conn = mysql.connector.connect(**mariadb_config)
        if process_schema_sql_file(mariadb_conn, args.sql_file):
            print("Importul schemei a fost realizat cu succes!")
        else:
            print("Importul schemei a eșuat.")
    except mysql.connector.Error as err:
        print(f"Eroare la conectarea la MariaDB: {err}")
    finally:
        if mariadb_conn:
            mariadb_conn.close()

if __name__ == "__main__":
    main()