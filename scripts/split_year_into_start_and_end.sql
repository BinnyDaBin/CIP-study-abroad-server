UPDATE courses
SET start_year = split_part(year, '-', 1)::integer,
	end_year = split_part(year, '-', 2)::integer;
