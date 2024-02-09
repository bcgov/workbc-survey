--
-- PostgreSQL database dump
--

-- Dumped from database version 12.4 (Debian 12.4-1.pgdg100+1)
-- Dumped by pg_dump version 16.0

-- Started on 2024-02-07 13:43:04 PST

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
-- TOC entry 8 (class 2615 OID 41462)
-- Name: api; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA api;


--
-- TOC entry 6 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 204 (class 1259 OID 41468)
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
    "surveyCompleted" boolean DEFAULT false
);


--
-- TOC entry 203 (class 1259 OID 41466)
-- Name: recipients_id_seq; Type: SEQUENCE; Schema: api; Owner: -
--

ALTER TABLE api.recipients ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME api.recipients_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 206 (class 1259 OID 41481)
-- Name: surveys; Type: TABLE; Schema: api; Owner: -
--

CREATE TABLE api.surveys (
    id integer NOT NULL,
    "surveyId" character varying NOT NULL,
    "surveyLink" character varying NOT NULL,
    email json
);


--
-- TOC entry 205 (class 1259 OID 41479)
-- Name: surveys_id_seq; Type: SEQUENCE; Schema: api; Owner: -
--

ALTER TABLE api.surveys ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME api.surveys_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 2791 (class 2606 OID 41478)
-- Name: recipients names_pkey; Type: CONSTRAINT; Schema: api; Owner: -
--

ALTER TABLE ONLY api.recipients
    ADD CONSTRAINT names_pkey PRIMARY KEY (id);


--
-- TOC entry 2793 (class 2606 OID 41488)
-- Name: surveys surveys_pkey; Type: CONSTRAINT; Schema: api; Owner: -
--

ALTER TABLE ONLY api.surveys
    ADD CONSTRAINT surveys_pkey PRIMARY KEY (id);


-- Completed on 2024-02-07 13:43:05 PST

--
-- PostgreSQL database dump complete
--

