--
-- PostgreSQL database dump
--

-- Dumped from database version 15.6 (Postgres.app)
-- Dumped by pg_dump version 15.6 (Postgres.app)

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
-- Name: Game; Type: TABLE; Schema: public; Owner: ggg
--

CREATE TABLE public."Game" (
    id integer NOT NULL,
    "player1Id" text NOT NULL,
    "player2Id" text,
    status text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    winner text,
    "currentTurn" text NOT NULL,
    mode text NOT NULL,
    name text DEFAULT 'Game'::text NOT NULL
);


ALTER TABLE public."Game" OWNER TO ggg;

--
-- Name: GameMove; Type: TABLE; Schema: public; Owner: ggg
--

CREATE TABLE public."GameMove" (
    id integer NOT NULL,
    "gameId" integer NOT NULL,
    "position" integer NOT NULL,
    symbol text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" text NOT NULL
);


ALTER TABLE public."GameMove" OWNER TO ggg;

--
-- Name: GameMove_id_seq; Type: SEQUENCE; Schema: public; Owner: ggg
--

CREATE SEQUENCE public."GameMove_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."GameMove_id_seq" OWNER TO ggg;

--
-- Name: GameMove_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ggg
--

ALTER SEQUENCE public."GameMove_id_seq" OWNED BY public."GameMove".id;


--
-- Name: Game_id_seq; Type: SEQUENCE; Schema: public; Owner: ggg
--

CREATE SEQUENCE public."Game_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Game_id_seq" OWNER TO ggg;

--
-- Name: Game_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ggg
--

ALTER SEQUENCE public."Game_id_seq" OWNED BY public."Game".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: ggg
--

CREATE TABLE public."User" (
    id text NOT NULL,
    "socketId" text NOT NULL,
    name text NOT NULL,
    status text DEFAULT 'waiting'::text NOT NULL
);


ALTER TABLE public."User" OWNER TO ggg;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: ggg
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO ggg;

--
-- Name: Game id; Type: DEFAULT; Schema: public; Owner: ggg
--

ALTER TABLE ONLY public."Game" ALTER COLUMN id SET DEFAULT nextval('public."Game_id_seq"'::regclass);


--
-- Name: GameMove id; Type: DEFAULT; Schema: public; Owner: ggg
--

ALTER TABLE ONLY public."GameMove" ALTER COLUMN id SET DEFAULT nextval('public."GameMove_id_seq"'::regclass);


--
-- Data for Name: Game; Type: TABLE DATA; Schema: public; Owner: ggg
--

COPY public."Game" (id, "player1Id", "player2Id", status, "createdAt", winner, "currentTurn", mode, name) FROM stdin;
9	5LoKxiuKNuCgNSpVAAAN	5LoKxiuKNuCgNSpVAAAN	finished	2024-05-19 09:10:20.373	COMPUTER	X	single	Single Player
10	XjIZ-Sw9OXgYGdRcAAAT	XjIZ-Sw9OXgYGdRcAAAT	finished	2024-05-19 09:10:36.306	COMPUTER	X	single	Single Player
11	eiXrAUaEnNO79WyHAAAZ	eiXrAUaEnNO79WyHAAAZ	finished	2024-05-19 09:10:48.508	COMPUTER	X	single	Single Player
12	71muE1p1UU241eigAAAf	71muE1p1UU241eigAAAf	finished	2024-05-19 09:10:59.263	YOU	X	single	Single Player
13	HOmmVY9AVQOdfEwXAAAl	HOmmVY9AVQOdfEwXAAAl	finished	2024-05-19 09:12:25.817	YOU	X	single	Single Player
14	WC-qcd2fyuy84EYcAAAr	WC-qcd2fyuy84EYcAAAr	finished	2024-05-19 09:12:36.306	COMPUTER	X	single	Single Player
19	KnWWKnadzFtnILHRAABL	KnWWKnadzFtnILHRAABL	waiting	2024-05-19 10:00:45.707	\N	X	multi	Single Player
20	83YcXErXM3yDW3NWAAAB	83YcXErXM3yDW3NWAAAB	waiting	2024-05-19 10:05:30.064	\N	X	multi	Multiplayer Game
21	iuotN4etbu6xGSsNAAAD	iuotN4etbu6xGSsNAAAD	waiting	2024-05-19 10:10:44.696	\N	X	multi	Multiplayer Game
22	RFS6QSl4GLl0n5agAAAD	RFS6QSl4GLl0n5agAAAD	waiting	2024-05-19 10:16:28.673	\N	X	multi	Multiplayer Game
23	DhIp3Btm5sgjZYuhAAAB	DhIp3Btm5sgjZYuhAAAB	waiting	2024-05-19 10:26:17.775	\N	X	multi	Multiplayer Game
24	6l4lkZjrEpFSfdGpAAAH	6l4lkZjrEpFSfdGpAAAH	waiting	2024-05-19 10:26:28.563	\N	X	multi	Multiplayer Game
2	VA_yV-JOLZNi-B_iAAAB	YJZkHHHDImsKDx04AAAH	active	2024-05-19 08:53:50.046	\N	X	single	Game
3	AHb1srSzj1Y3CTstAAAH	SpIgpX_ZNeY466XWAAAP	active	2024-05-19 08:54:01.773	\N	X	single	Game
4	7QBtS0-t-ZvpGyoEAAAL	b6fpIr_4QjPJjBvxAAAT	active	2024-05-19 08:57:58.761	\N	X	single	Game
5	u8CJ4uBcDH25RNXxAAAB	NrF3fdhQe2BQgPtDAAAB	active	2024-05-19 09:09:00.51	\N	X	single	Single Player
6	j1mdXMRnaxMRyohwAAAH	tif9VTFiVSi_d2UrAAAD	active	2024-05-19 09:09:05.806	\N	X	single	Single Player
7	AX8XHf0F2raMviHZAAAF	qc-_sXvUuNnlrVTfAAAH	active	2024-05-19 09:10:18.028	\N	X	single	Single Player
8	7wzKIfEV9_Weo9EcAAAJ	L3c8RhHjq9NYPUKmAAAN	active	2024-05-19 09:10:18.634	\N	X	single	Single Player
15	xfGEQ7vuWKob39tHAAA3	Ng_B0vqPPN8JF6ZxAAAR	active	2024-05-19 09:17:54.28	\N	X	multi	Single Player
16	gFDfK-eDdhlyh4Y-AAA7	QB3sdZo9KEJ4uGjPAAAB	active	2024-05-19 09:24:10.739	\N	X	multi	Single Player
17	0kgh8kOWmpMyT7FGAAA_	ypuPVrlyL7H4FuIEAAAB	active	2024-05-19 09:27:18.447	\N	X	multi	Single Player
18	s-1GY9NhOtT1laUXAABD	09zdyUg9ojvDsyeOAAAB	active	2024-05-19 09:29:47.175	\N	X	multi	Single Player
30	zWFXKBnCYu8rJ040AAAB	\N	ongoing	2024-05-22 11:27:39.187	\N	X	multi	Game
31	0A_c1XzukIWIawXYAAAH	\N	ongoing	2024-05-22 11:28:06.294	\N	X	multi	Game
32	v4Y2dugHYErCIr1lAAAL	\N	ongoing	2024-05-22 11:32:58.189	\N	X	multi	Game
33	GoRtxYZlwzDh9ug1AAAP	\N	ongoing	2024-05-22 11:47:34.819	\N	X	multi	Game
34	I-s0D8kqsV1LIHWNAAAB	\N	ongoing	2024-05-22 11:49:09.998	\N	X	multi	Game
35	xzyTNM-T7vignwNiAAAH	\N	ongoing	2024-05-22 11:49:14.344	\N	X	multi	Game
36	nX1D0nrzaAF0FlWtAAAB	\N	ongoing	2024-05-22 11:52:48.853	\N	X	multi	Game
37	LkwtKgOcUfzjzrqRAAAG	\N	ongoing	2024-05-22 11:52:49.344	\N	O	multi	Game
38	nSVv8q-67APsZVObAAAB	\N	ongoing	2024-05-22 12:05:12.478	\N	X	multi	Game
39	6Tvceh-2rxaAh3tcAAAF	\N	ongoing	2024-05-22 12:05:13.222	\N	X	multi	Game
\.


--
-- Data for Name: GameMove; Type: TABLE DATA; Schema: public; Owner: ggg
--

COPY public."GameMove" (id, "gameId", "position", symbol, "createdAt", "userId") FROM stdin;
1	37	0	X	2024-05-22 11:53:04.125	LkwtKgOcUfzjzrqRAAAG
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: ggg
--

COPY public."User" (id, "socketId", name, status) FROM stdin;
CFfO3kRHBZxj2ht-AAAD	CFfO3kRHBZxj2ht-AAAD	Single Player	waiting
computer	computer	Computer	waiting
VA_yV-JOLZNi-B_iAAAB	VA_yV-JOLZNi-B_iAAAB	Single Player	waiting
AHb1srSzj1Y3CTstAAAH	AHb1srSzj1Y3CTstAAAH	Single Player	waiting
7QBtS0-t-ZvpGyoEAAAL	7QBtS0-t-ZvpGyoEAAAL	Single Player	waiting
9NMDghwliiBBFpSPAAAD	9NMDghwliiBBFpSPAAAD	Player	waiting
u8CJ4uBcDH25RNXxAAAB	u8CJ4uBcDH25RNXxAAAB	Player	waiting
j1mdXMRnaxMRyohwAAAH	j1mdXMRnaxMRyohwAAAH	Player	waiting
AX8XHf0F2raMviHZAAAF	AX8XHf0F2raMviHZAAAF	Player	waiting
7wzKIfEV9_Weo9EcAAAJ	7wzKIfEV9_Weo9EcAAAJ	Player	waiting
5LoKxiuKNuCgNSpVAAAN	5LoKxiuKNuCgNSpVAAAN	Player	waiting
XjIZ-Sw9OXgYGdRcAAAT	XjIZ-Sw9OXgYGdRcAAAT	Player	waiting
eiXrAUaEnNO79WyHAAAZ	eiXrAUaEnNO79WyHAAAZ	Player	waiting
71muE1p1UU241eigAAAf	71muE1p1UU241eigAAAf	Player	waiting
HOmmVY9AVQOdfEwXAAAl	HOmmVY9AVQOdfEwXAAAl	Player	waiting
WC-qcd2fyuy84EYcAAAr	WC-qcd2fyuy84EYcAAAr	Player	waiting
xfGEQ7vuWKob39tHAAA3	xfGEQ7vuWKob39tHAAA3	Player	waiting
gFDfK-eDdhlyh4Y-AAA7	gFDfK-eDdhlyh4Y-AAA7	Player	waiting
0kgh8kOWmpMyT7FGAAA_	0kgh8kOWmpMyT7FGAAA_	Player	waiting
s-1GY9NhOtT1laUXAABD	s-1GY9NhOtT1laUXAABD	Player	waiting
KnWWKnadzFtnILHRAABL	KnWWKnadzFtnILHRAABL	Player	waiting
83YcXErXM3yDW3NWAAAB	83YcXErXM3yDW3NWAAAB	Player	waiting
iuotN4etbu6xGSsNAAAD	iuotN4etbu6xGSsNAAAD	Player	waiting
RFS6QSl4GLl0n5agAAAD	RFS6QSl4GLl0n5agAAAD	Player	waiting
DhIp3Btm5sgjZYuhAAAB	DhIp3Btm5sgjZYuhAAAB	Player	waiting
6l4lkZjrEpFSfdGpAAAH	6l4lkZjrEpFSfdGpAAAH	Player	waiting
YJZkHHHDImsKDx04AAAH	YJZkHHHDImsKDx04AAAH	Player	waiting
SpIgpX_ZNeY466XWAAAP	SpIgpX_ZNeY466XWAAAP	Player	waiting
b6fpIr_4QjPJjBvxAAAT	b6fpIr_4QjPJjBvxAAAT	Player	waiting
NrF3fdhQe2BQgPtDAAAB	NrF3fdhQe2BQgPtDAAAB	Player	waiting
tif9VTFiVSi_d2UrAAAD	tif9VTFiVSi_d2UrAAAD	Player	waiting
qc-_sXvUuNnlrVTfAAAH	qc-_sXvUuNnlrVTfAAAH	Player	waiting
L3c8RhHjq9NYPUKmAAAN	L3c8RhHjq9NYPUKmAAAN	Player	waiting
Ng_B0vqPPN8JF6ZxAAAR	Ng_B0vqPPN8JF6ZxAAAR	Player	waiting
QB3sdZo9KEJ4uGjPAAAB	QB3sdZo9KEJ4uGjPAAAB	Player	waiting
ypuPVrlyL7H4FuIEAAAB	ypuPVrlyL7H4FuIEAAAB	Player	waiting
09zdyUg9ojvDsyeOAAAB	09zdyUg9ojvDsyeOAAAB	Player	waiting
ik9ga2Le9xzen6JrAAAF	ik9ga2Le9xzen6JrAAAF	Player	waiting
ULtLm_ce1D3xbaZfAAAH	ULtLm_ce1D3xbaZfAAAH	Player	waiting
3FgGcwU7WnSUwVuEAAAL	3FgGcwU7WnSUwVuEAAAL	Player	waiting
zWFXKBnCYu8rJ040AAAB	zWFXKBnCYu8rJ040AAAB	Player	waiting
0A_c1XzukIWIawXYAAAH	0A_c1XzukIWIawXYAAAH	Player	waiting
v4Y2dugHYErCIr1lAAAL	v4Y2dugHYErCIr1lAAAL	Player	waiting
GoRtxYZlwzDh9ug1AAAP	GoRtxYZlwzDh9ug1AAAP	Player	waiting
I-s0D8kqsV1LIHWNAAAB	I-s0D8kqsV1LIHWNAAAB	Player	waiting
xzyTNM-T7vignwNiAAAH	xzyTNM-T7vignwNiAAAH	Player	waiting
nX1D0nrzaAF0FlWtAAAB	nX1D0nrzaAF0FlWtAAAB	Player	waiting
LkwtKgOcUfzjzrqRAAAG	LkwtKgOcUfzjzrqRAAAG	Player	waiting
nSVv8q-67APsZVObAAAB	nSVv8q-67APsZVObAAAB	Player	waiting
6Tvceh-2rxaAh3tcAAAF	6Tvceh-2rxaAh3tcAAAF	Player	waiting
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: ggg
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
a277f095-4398-4096-9467-fab7d5ad2e56	04945f46a6b6f907399d3e2ca336209d04ab00253896ed4bdd9d317b6162326e	2024-05-18 19:53:07.254778+05	20240518145307_add_multiplayer_schema	\N	\N	2024-05-18 19:53:07.244745+05	1
9c531554-463b-4c09-8034-e5d4a7676b60	55fdbf3298fb86b21e88f7d94092d0b557574f3e64a028f8006b8a5647f7e78a	2024-05-18 20:54:13.580653+05	20240518155413_add_game_moves_and_winner	\N	\N	2024-05-18 20:54:13.575232+05	1
15d6fc8d-d3c3-417e-966f-29165daf788f	b7c368870513eda26db120d925a8a024fe4833b021999a73dc980fae36dd4143	2024-05-18 20:58:21.537876+05	20240518155821_add_game_moves_and_winne	\N	\N	2024-05-18 20:58:21.534996+05	1
f8d71f82-2e57-4da0-8526-77304e34b8c2	ee3e3ca2ca5f5de3495bd70789f46124c59aa789061afdba734a7d7603584f65	2024-05-18 21:05:12.432312+05	20240518160512_add_game_moves_and_mode	\N	\N	2024-05-18 21:05:12.43089+05	1
dfe34f6e-4766-4a7a-b447-16c497a508bd	1f63257d11fd2f91e6c88a916a4c2839441f5ef536a79ee4cf982de2b3195fa9	2024-05-19 14:02:57.673916+05	20240519090257_adding_name	\N	\N	2024-05-19 14:02:57.669097+05	1
c4ffdc4c-fa1c-4fb3-9b9b-929db3195f4e	2bc74968ebf234bd119a30c5291ecc41d4bc8e8e3486708d319458ba38c8ad46	2024-05-19 15:13:20.721254+05	20240519101320_adding_name	\N	\N	2024-05-19 15:13:20.719048+05	1
7c3b2fab-0493-4750-b724-0ab877c6d30c	f0cd7afd8277250232a3bab83d159fc699c9e5289646ae35ca676fac07b4210d	2024-05-19 15:25:50.807004+05	20240519102550_adding_userid	\N	\N	2024-05-19 15:25:50.805229+05	1
0be55352-c38b-4895-8f0b-6259f155c37f	5deac3b60bf62aefb2dbaf678c02f286909f93f36b68d64b2a247877c7cbb194	2024-05-22 16:21:47.348388+05	20240522112147_dynamic_userid	\N	\N	2024-05-22 16:21:47.34346+05	1
\.


--
-- Name: GameMove_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ggg
--

SELECT pg_catalog.setval('public."GameMove_id_seq"', 1, true);


--
-- Name: Game_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ggg
--

SELECT pg_catalog.setval('public."Game_id_seq"', 39, true);


--
-- Name: GameMove GameMove_pkey; Type: CONSTRAINT; Schema: public; Owner: ggg
--

ALTER TABLE ONLY public."GameMove"
    ADD CONSTRAINT "GameMove_pkey" PRIMARY KEY (id);


--
-- Name: Game Game_pkey; Type: CONSTRAINT; Schema: public; Owner: ggg
--

ALTER TABLE ONLY public."Game"
    ADD CONSTRAINT "Game_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: ggg
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: ggg
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: User_socketId_key; Type: INDEX; Schema: public; Owner: ggg
--

CREATE UNIQUE INDEX "User_socketId_key" ON public."User" USING btree ("socketId");


--
-- Name: GameMove GameMove_gameId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ggg
--

ALTER TABLE ONLY public."GameMove"
    ADD CONSTRAINT "GameMove_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES public."Game"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Game Game_player1Id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ggg
--

ALTER TABLE ONLY public."Game"
    ADD CONSTRAINT "Game_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Game Game_player2Id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ggg
--

ALTER TABLE ONLY public."Game"
    ADD CONSTRAINT "Game_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

