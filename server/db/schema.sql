--
-- PostgreSQL database dump
--

-- Dumped from database version 16rc1
-- Dumped by pg_dump version 16rc1

DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'hcapp') THEN
    -- Role does not exist, create it
    CREATE ROLE hcapp LOGIN PASSWORD 'password';
    GRANT ALL PRIVILEGES ON SCHEMA public TO hcapp;
  END IF;
END $$;

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: dates; Type: TABLE; Schema: public; Owner: hcapp
--

CREATE TABLE IF NOT EXISTS public.dates (
    date_id integer NOT NULL,
    date date NOT NULL
);


ALTER TABLE public.dates OWNER TO hcapp;

--
-- Name: dates_date_id_seq; Type: SEQUENCE; Schema: public; Owner: hcapp
--

CREATE SEQUENCE IF NOT EXISTS public.dates_date_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dates_date_id_seq OWNER TO hcapp;

--
-- Name: dates_date_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hcapp
--

ALTER SEQUENCE public.dates_date_id_seq OWNED BY public.dates.date_id;


--
-- Name: departments; Type: TABLE; Schema: public; Owner: hcapp
--

CREATE TABLE IF NOT EXISTS public.departments (
    departmentid integer NOT NULL,
    name character varying(255),
    details text,
    image character varying(255)
);


ALTER TABLE public.departments OWNER TO hcapp;

--
-- Name: departments_departmentid_seq; Type: SEQUENCE; Schema: public; Owner: hcapp
--

CREATE SEQUENCE IF NOT EXISTS public.departments_departmentid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.departments_departmentid_seq OWNER TO hcapp;

--
-- Name: departments_departmentid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hcapp
--

ALTER SEQUENCE public.departments_departmentid_seq OWNED BY public.departments.departmentid;


--
-- Name: doctor_dates; Type: TABLE; Schema: public; Owner: hcapp
--

CREATE TABLE IF NOT EXISTS public.doctor_dates (
    doctorid integer NOT NULL,
    date_id integer NOT NULL
);


ALTER TABLE public.doctor_dates OWNER TO hcapp;

--
-- Name: doctors; Type: TABLE; Schema: public; Owner: hcapp
--

CREATE TABLE IF NOT EXISTS public.doctors (
    doctorid integer NOT NULL,
    name character varying(255),
    specialization character varying(255),
    departmentid integer,
    rating numeric,
    about text,
    image character varying(255)
);


ALTER TABLE public.doctors OWNER TO hcapp;

--
-- Name: doctors_doctorid_seq; Type: SEQUENCE; Schema: public; Owner: hcapp
--

CREATE SEQUENCE IF NOT EXISTS public.doctors_doctorid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.doctors_doctorid_seq OWNER TO hcapp;

--
-- Name: doctors_doctorid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hcapp
--

ALTER SEQUENCE public.doctors_doctorid_seq OWNED BY public.doctors.doctorid;


--
-- Name: slots; Type: TABLE; Schema: public; Owner: hcapp
--

CREATE TABLE IF NOT EXISTS public.slots (
    slot_id integer NOT NULL,
    date_id integer NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    available boolean DEFAULT true
);


ALTER TABLE public.slots OWNER TO hcapp;

--
-- Name: slots_slot_id_seq; Type: SEQUENCE; Schema: public; Owner: hcapp
--

CREATE SEQUENCE public.slots_slot_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.slots_slot_id_seq OWNER TO hcapp;

--
-- Name: slots_slot_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hcapp
--

ALTER SEQUENCE public.slots_slot_id_seq OWNED BY public.slots.slot_id;


--
-- Name: tokens; Type: TABLE; Schema: public; Owner: hcapp
--

CREATE TABLE IF NOT EXISTS public.tokens (
    tokenid integer NOT NULL,
    userid integer,
    slotid integer
);


ALTER TABLE public.tokens OWNER TO hcapp;

--
-- Name: tokens_tokenid_seq; Type: SEQUENCE; Schema: public; Owner: hcapp
--

CREATE SEQUENCE IF NOT EXISTS public.tokens_tokenid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tokens_tokenid_seq OWNER TO hcapp;

--
-- Name: tokens_tokenid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hcapp
--

ALTER SEQUENCE public.tokens_tokenid_seq OWNED BY public.tokens.tokenid;


--
-- Name: users; Type: TABLE; Schema: public; Owner: hcapp
--

CREATE TABLE IF NOT EXISTS public.users (
    userid integer NOT NULL,
    username character varying(255),
    email character varying(255),
    password character varying(255),
    sessionid character varying(255)
);


ALTER TABLE public.users OWNER TO hcapp;

--
-- Name: users_userid_seq; Type: SEQUENCE; Schema: public; Owner: hcapp
--

CREATE SEQUENCE IF NOT EXISTS public.users_userid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_userid_seq OWNER TO hcapp;

--
-- Name: users_userid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hcapp
--

ALTER SEQUENCE public.users_userid_seq OWNED BY public.users.userid;


--
-- Name: dates date_id; Type: DEFAULT; Schema: public; Owner: hcapp
--

ALTER TABLE ONLY public.dates ALTER COLUMN date_id SET DEFAULT nextval('public.dates_date_id_seq'::regclass);


--
-- Name: departments departmentid; Type: DEFAULT; Schema: public; Owner: hcapp
--

ALTER TABLE ONLY public.departments ALTER COLUMN departmentid SET DEFAULT nextval('public.departments_departmentid_seq'::regclass);


--
-- Name: doctors doctorid; Type: DEFAULT; Schema: public; Owner: hcapp
--

ALTER TABLE ONLY public.doctors ALTER COLUMN doctorid SET DEFAULT nextval('public.doctors_doctorid_seq'::regclass);


--
-- Name: slots slot_id; Type: DEFAULT; Schema: public; Owner: hcapp
--

ALTER TABLE ONLY public.slots ALTER COLUMN slot_id SET DEFAULT nextval('public.slots_slot_id_seq'::regclass);


--
-- Name: tokens tokenid; Type: DEFAULT; Schema: public; Owner: hcapp
--

ALTER TABLE ONLY public.tokens ALTER COLUMN tokenid SET DEFAULT nextval('public.tokens_tokenid_seq'::regclass);


--
-- Name: users userid; Type: DEFAULT; Schema: public; Owner: hcapp
--

ALTER TABLE ONLY public.users ALTER COLUMN userid SET DEFAULT nextval('public.users_userid_seq'::regclass);


--
-- Name: dates dates_pkey; Type: CONSTRAINT; Schema: public; Owner: hcapp
--

ALTER TABLE ONLY public.dates
    ADD CONSTRAINT dates_pkey PRIMARY KEY (date_id);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: hcapp
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (departmentid);


--
-- Name: doctor_dates doctor_dates_pkey; Type: CONSTRAINT; Schema: public; Owner: hcapp
--

ALTER TABLE ONLY public.doctor_dates
    ADD CONSTRAINT doctor_dates_pkey PRIMARY KEY (doctorid, date_id);


--
-- Name: doctors doctors_pkey; Type: CONSTRAINT; Schema: public; Owner: hcapp
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_pkey PRIMARY KEY (doctorid);


--
-- Name: slots slots_pkey; Type: CONSTRAINT; Schema: public; Owner: hcapp
--

ALTER TABLE ONLY public.slots
    ADD CONSTRAINT slots_pkey PRIMARY KEY (slot_id);


--
-- Name: tokens tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: hcapp
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT tokens_pkey PRIMARY KEY (tokenid);


--
-- Name: tokens tokens_userid_key; Type: CONSTRAINT; Schema: public; Owner: hcapp
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT tokens_userid_key UNIQUE (userid);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: hcapp
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (userid);


--
-- Name: doctor_dates doctor_dates_date_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hcapp
--

ALTER TABLE ONLY public.doctor_dates
    ADD CONSTRAINT doctor_dates_date_id_fkey FOREIGN KEY (date_id) REFERENCES public.dates(date_id);


--
-- Name: doctor_dates doctor_dates_doctorid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hcapp
--

ALTER TABLE ONLY public.doctor_dates
    ADD CONSTRAINT doctor_dates_doctorid_fkey FOREIGN KEY (doctorid) REFERENCES public.doctors(doctorid);


--
-- Name: doctors doctors_departmentid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hcapp
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_departmentid_fkey FOREIGN KEY (departmentid) REFERENCES public.departments(departmentid);


--
-- Name: slots slots_date_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hcapp
--

ALTER TABLE ONLY public.slots
    ADD CONSTRAINT slots_date_id_fkey FOREIGN KEY (date_id) REFERENCES public.dates(date_id);


--
-- Name: tokens tokens_slotid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hcapp
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT tokens_slotid_fkey FOREIGN KEY (slotid) REFERENCES public.slots(slot_id);


--
-- Name: tokens tokens_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hcapp
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT tokens_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(userid);


--
-- PostgreSQL database dump complete
--

