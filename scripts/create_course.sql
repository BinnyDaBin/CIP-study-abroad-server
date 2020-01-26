CREATE TABLE courses(
	id serial PRIMARY KEY,
	study_abroad_institution text,
	program_name text,
	year text,
	start_year integer,
	end_year integer,
	kzoo_course_name text,
	kzoo_discipline text,
	host_insti_course_number text,
	host_insti_course_name text
);