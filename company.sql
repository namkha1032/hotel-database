-- a
select * from employee 
where date_part('year', current_date) - date_part('year', bdate) > 30 and salary > 10000;

-- b
select * from employee 
join department on employee.dno = department.dnumber where department.dname='Research' and employee.sex = 'F';

-- c
select * from employee 
join department on employee.dno = department.dnumber where department.dname='Research' and employee.sex = 'M' and 
exists (select * from works_on where works_on.essn = employee.ssn and works_on.hours >=10);

-- d
select * from employee
join department on employee.dno = department.dnumber where department.dname='Research' and department.mgr_ssn = employee.ssn;

-- e
select * from employee
where employee.super_ssn = (SELECT mgr_ssn from department where department.dname='Research');

-- f
select project.*, count(*) as total_employee, sum(works_on.hours) as total_hours from project
left join works_on on project.pnumber = works_on.pno
group by project.pnumber;

-- g
select department.*, jsonb_agg(jsonb_build_object(
	'employee_name', employee.fname
)) from department join employee on department.dnumber = employee.dno 
group by department.dnumber;

-- h
select * from employee join (select * from works_on join project on works_on.pno = project.pnumber) as pro_work
on employee.ssn = pro_work.essn where pro_work.pname = 'Olympus';

-- i
select * from employee where not exists
(select * from works_on join project on works_on.pno = project.pnumber 
 where works_on.essn = employee.ssn and project.plocation = 'Houston');
 
-- j
select * from employee where not exists
(select * from works_on join project on works_on.pno = project.pnumber 
 where works_on.essn = employee.ssn and project.plocation <> 'Houston');
 
-- k
select * from employee where employee.salary = (select max(employee.salary) from employee);
 
-- -- l
-- select * from employee e1 left join department d1 on e1.dno = d1.dnumber
-- where e1.salary = (select e2.salary from employee e2 join department d2 on e2.dno = d2.dnumber where d2.dnumber = d1.dnumber order by e2.salary desc limit 1);

-- l
select * from employee e1 left join department d1 on e1.dno = d1.dnumber
where e1.salary = (select max(e2.salary) from employee e2 join department d2 on e2.dno = d2.dnumber where d2.dnumber = d1.dnumber);

-- m
select e1.ssn from employee e1 join works_on w1 on e1.ssn = w1.essn
group by e1.ssn having count(*) = (select count(*) from employee e2 join works_on w2 on e2.ssn = w2.essn group by e2.ssn order by count(*) desc limit 1);

-- n
select department.*, jsonb_agg(jsonb_build_object(
	'employee_name', employee.fname
)) from department left join employee on department.dnumber = employee.dno
where employee.ssn = any (select e1.ssn from employee e1 join works_on w1 on e1.ssn = w1.essn where e1.dno = department.dnumber
group by e1.ssn having count(*) = (select count(*) from employee e2 join works_on w2 on e2.ssn = w2.essn where e2.dno = department.dnumber group by e2.ssn order by count(*) desc limit 1))
group by department.dnumber;

-- o
select employee.* from employee join department on employee.ssn = department.mgr_ssn
where not exists (select * from works_on where works_on.essn = employee.ssn);