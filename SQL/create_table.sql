--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Debian 15.1-1.pgdg110+1)
-- Dumped by pg_dump version 16.0

-- Started on 2024-02-16 11:10:30 PST

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

--
-- TOC entry 6 (class 2615 OID 32990)
-- Name: api; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA api;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 32991)
-- Name: recipients; Type: TABLE; Schema: api; Owner: -
--

CREATE TABLE api.recipients (
    id integer NOT NULL,
    "firstName" character varying,
    email character varying,
    "emailSent" boolean DEFAULT false,
    "emailId" character varying,
    "surveyType" character varying,
    "surveyDate" date,
    "contactId" character varying(50),
    "timestamp" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    language character varying(3),
    reminders jsonb,
    "emailError" boolean DEFAULT false,
    "surveyCompleted" boolean DEFAULT false,
    "lastName" character varying
);


--
-- TOC entry 216 (class 1259 OID 33001)
-- Name: surveys; Type: TABLE; Schema: api; Owner: -
--

CREATE TABLE api.surveys (
    id integer NOT NULL,
    "surveyId" character varying NOT NULL,
    "surveyLink" character varying NOT NULL,
    email json
);


--
-- TOC entry 3185 (class 2606 OID 33008)
-- Name: recipients names_pkey; Type: CONSTRAINT; Schema: api; Owner: -
--

ALTER TABLE ONLY api.recipients
    ADD CONSTRAINT names_pkey PRIMARY KEY (id);


--
-- TOC entry 3187 (class 2606 OID 33010)
-- Name: surveys surveys_pkey; Type: CONSTRAINT; Schema: api; Owner: -
--

ALTER TABLE ONLY api.surveys
    ADD CONSTRAINT surveys_pkey PRIMARY KEY (id);


-- Completed on 2024-02-16 11:10:30 PST

--
-- PostgreSQL database dump complete
--

