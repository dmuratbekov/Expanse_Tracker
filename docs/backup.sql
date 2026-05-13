--
-- PostgreSQL database dump
--

\restrict yP2pI4DlIZf94h6LuNrE8bLXGTd54fTUdCIu6n4Crceb4zbAWgi2uNaz2hKQShq

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: create_default_categories(uuid); Type: FUNCTION; Schema: public; Owner: finance_user
--

CREATE FUNCTION public.create_default_categories(p_user_id uuid) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO categories (user_id, name, type, color, icon) VALUES
    -- Расходы
    (p_user_id, 'Продукты',      'expense', '#ef4444', 'shopping-cart'),
    (p_user_id, 'Транспорт',     'expense', '#f97316', 'car'),
    (p_user_id, 'Рестораны',     'expense', '#eab308', 'utensils'),
    (p_user_id, 'Развлечения',   'expense', '#a855f7', 'gamepad'),
    (p_user_id, 'Здоровье',      'expense', '#ec4899', 'heart'),
    (p_user_id, 'Коммунальные',  'expense', '#14b8a6', 'home'),
    (p_user_id, 'Одежда',        'expense', '#8b5cf6', 'shirt'),
    (p_user_id, 'Образование',   'expense', '#06b6d4', 'book'),
    -- Доходы
    (p_user_id, 'Зарплата',      'income',  '#22c55e', 'briefcase'),
    (p_user_id, 'Фриланс',       'income',  '#10b981', 'laptop'),
    (p_user_id, 'Подарки',       'income',  '#84cc16', 'gift'),
    (p_user_id, 'Инвестиции',    'income',  '#3b82f6', 'trending-up');
END;
$$;


ALTER FUNCTION public.create_default_categories(p_user_id uuid) OWNER TO finance_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: finance_user
--

CREATE TABLE public.accounts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    type character varying(50) DEFAULT 'cash'::character varying NOT NULL,
    balance numeric(12,2) DEFAULT 0.00 NOT NULL,
    currency character varying(10) DEFAULT 'KGS'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT chk_account_type CHECK (((type)::text = ANY ((ARRAY['cash'::character varying, 'card'::character varying, 'savings'::character varying])::text[]))),
    CONSTRAINT chk_balance CHECK ((balance >= '-999999999.99'::numeric))
);


ALTER TABLE public.accounts OWNER TO finance_user;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: finance_user
--

CREATE TABLE public.categories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    type character varying(10) NOT NULL,
    color character varying(7) DEFAULT '#6366f1'::character varying NOT NULL,
    icon character varying(50) DEFAULT 'tag'::character varying NOT NULL,
    CONSTRAINT chk_category_type CHECK (((type)::text = ANY ((ARRAY['income'::character varying, 'expense'::character varying])::text[])))
);


ALTER TABLE public.categories OWNER TO finance_user;

--
-- Name: transactions; Type: TABLE; Schema: public; Owner: finance_user
--

CREATE TABLE public.transactions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    account_id uuid NOT NULL,
    category_id uuid,
    amount numeric(12,2) NOT NULL,
    type character varying(10) NOT NULL,
    description text,
    transaction_date date DEFAULT CURRENT_DATE NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT chk_amount CHECK ((amount > (0)::numeric)),
    CONSTRAINT chk_transaction_type CHECK (((type)::text = ANY ((ARRAY['income'::character varying, 'expense'::character varying])::text[])))
);


ALTER TABLE public.transactions OWNER TO finance_user;

--
-- Name: users; Type: TABLE; Schema: public; Owner: finance_user
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    full_name character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO finance_user;

--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: finance_user
--

COPY public.accounts (id, user_id, name, type, balance, currency, created_at) FROM stdin;
9bdca278-3886-4919-b123-32d855e15155	166d8d80-d468-4b6c-81fe-c4f3481c874f	��������	cash	5000.00	KGS	2026-04-13 13:47:43.666938+05
b6114a50-c1ef-4cdd-8b4d-78f73351f407	166d8d80-d468-4b6c-81fe-c4f3481c874f	Основной счёт	card	48500.00	KGS	2026-04-09 15:11:32.692119+05
08d7d028-013a-4861-83aa-ca0da579bb26	71d4809f-80fe-401a-abd2-1c47a9be42c4	Основной счёт	card	0.00	KGS	2026-05-07 02:32:29.28471+05
dfc79a52-6b2a-412d-a7a0-8066ea07878d	cf7389db-100b-4eb2-9ee9-f1798f34d406	Основной счёт	card	0.00	KGS	2026-05-09 22:27:13.434706+05
6468e111-7b7c-49db-ad0a-0d4648e3612b	aee73495-c6de-41ed-b473-f816542e5f67	Основной счёт	card	379.00	KGS	2026-05-05 15:28:37.189968+05
71220141-b31d-42a0-9254-dfc3adf9557b	db072db6-6367-41a5-b487-eee0cf2b2d42	Основной счёт	card	7894.44	KGS	2026-04-30 14:27:52.617294+05
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: finance_user
--

COPY public.categories (id, user_id, name, type, color, icon) FROM stdin;
d83e5780-997b-4e38-a861-8e9af9d3b306	166d8d80-d468-4b6c-81fe-c4f3481c874f	Продукты	expense	#ef4444	shopping-cart
3dde8458-b801-4232-82b7-62ace4d21d1f	166d8d80-d468-4b6c-81fe-c4f3481c874f	Транспорт	expense	#f97316	car
4fb8c445-4c80-4c8f-aa24-a4900cb7c2a7	166d8d80-d468-4b6c-81fe-c4f3481c874f	Рестораны	expense	#eab308	utensils
6447d260-26c0-4c26-927e-384e80ba2060	166d8d80-d468-4b6c-81fe-c4f3481c874f	Развлечения	expense	#a855f7	gamepad
48d5a193-6b30-4605-84a7-de4c221ec320	166d8d80-d468-4b6c-81fe-c4f3481c874f	Здоровье	expense	#ec4899	heart
d03796a4-744a-4393-8d21-945ec5e52aa0	166d8d80-d468-4b6c-81fe-c4f3481c874f	Коммунальные	expense	#14b8a6	home
608a5318-9ae0-4f55-8ef0-97480dc26468	166d8d80-d468-4b6c-81fe-c4f3481c874f	Одежда	expense	#8b5cf6	shirt
42504be3-53da-4746-86dd-1ce1215dbb4c	166d8d80-d468-4b6c-81fe-c4f3481c874f	Образование	expense	#06b6d4	book
ac9b3ecd-3b14-4088-80a7-74de55381bc0	166d8d80-d468-4b6c-81fe-c4f3481c874f	Зарплата	income	#22c55e	briefcase
70bed9b7-da3b-4931-b7bc-03a9c058224f	166d8d80-d468-4b6c-81fe-c4f3481c874f	Фриланс	income	#10b981	laptop
91dc50ee-9ce5-4a9c-81bc-aa96fa780929	166d8d80-d468-4b6c-81fe-c4f3481c874f	Подарки	income	#84cc16	gift
59e202ac-444f-41ac-9ac3-a2e231845475	166d8d80-d468-4b6c-81fe-c4f3481c874f	Инвестиции	income	#3b82f6	trending-up
43de48bd-5453-4919-b112-9c4e9b0bdb49	db072db6-6367-41a5-b487-eee0cf2b2d42	Продукты	expense	#ef4444	shopping-cart
65503ec4-2fa2-40db-9084-3cb86b424a5a	db072db6-6367-41a5-b487-eee0cf2b2d42	Транспорт	expense	#f97316	car
f03c9d6c-ebea-43c3-8eea-fed45c0ffa18	db072db6-6367-41a5-b487-eee0cf2b2d42	Рестораны	expense	#eab308	utensils
7adfbbca-de54-4837-9250-68143a09988d	db072db6-6367-41a5-b487-eee0cf2b2d42	Развлечения	expense	#a855f7	gamepad
c81c7956-43bf-4346-9738-f3fef55a7d91	db072db6-6367-41a5-b487-eee0cf2b2d42	Здоровье	expense	#ec4899	heart
560f857b-29d3-47ec-a585-0e704ed07955	db072db6-6367-41a5-b487-eee0cf2b2d42	Коммунальные	expense	#14b8a6	home
16286aa0-704d-466b-8fec-63468a4423db	db072db6-6367-41a5-b487-eee0cf2b2d42	Одежда	expense	#8b5cf6	shirt
4cd07c1d-1f3d-47e2-a200-ab6175f1a66e	db072db6-6367-41a5-b487-eee0cf2b2d42	Образование	expense	#06b6d4	book
97a026d9-3d0f-49e8-beca-2a9705a6650d	db072db6-6367-41a5-b487-eee0cf2b2d42	Зарплата	income	#22c55e	briefcase
3fea550f-8ca9-44e0-a1a3-040eef4e0132	db072db6-6367-41a5-b487-eee0cf2b2d42	Фриланс	income	#10b981	laptop
4a01a9ca-fe08-4a7e-ab83-7e4e119cb805	db072db6-6367-41a5-b487-eee0cf2b2d42	Подарки	income	#84cc16	gift
d62db2bc-ab89-4f8e-baa1-9cdac584c6ef	db072db6-6367-41a5-b487-eee0cf2b2d42	Инвестиции	income	#3b82f6	trending-up
efd2a87c-88e9-4ecc-b2fd-0236733838d3	aee73495-c6de-41ed-b473-f816542e5f67	Продукты	expense	#ef4444	shopping-cart
76cc68dd-fb41-4742-9b29-892a280c7cbf	aee73495-c6de-41ed-b473-f816542e5f67	Рестораны	expense	#eab308	utensils
fc5357a2-2855-4af8-ab37-396002040fd5	aee73495-c6de-41ed-b473-f816542e5f67	Развлечения	expense	#a855f7	gamepad
5948f3e1-3cd2-4579-b63a-19b3b9a07526	aee73495-c6de-41ed-b473-f816542e5f67	Коммунальные	expense	#14b8a6	home
a8f0bbcf-f400-442f-8f25-5b936f07d166	aee73495-c6de-41ed-b473-f816542e5f67	Одежда	expense	#8b5cf6	shirt
c98f58b8-a643-4688-997a-a8da05037517	aee73495-c6de-41ed-b473-f816542e5f67	Образование	expense	#06b6d4	book
e60eb5d9-8e7f-4a71-98c8-42dc0945df24	aee73495-c6de-41ed-b473-f816542e5f67	Зарплата	income	#22c55e	briefcase
1d790bed-e803-4e65-baf7-99af80f17e46	aee73495-c6de-41ed-b473-f816542e5f67	Подарки	income	#84cc16	gift
dafd1251-dd48-4599-84c0-76428d5ae38e	71d4809f-80fe-401a-abd2-1c47a9be42c4	Продукты	expense	#ef4444	shopping-cart
d2eb7737-0d12-4b87-befa-cc271436f4f5	71d4809f-80fe-401a-abd2-1c47a9be42c4	Транспорт	expense	#f97316	car
d9bb373c-c3bc-4f60-8d45-14a343c393a7	71d4809f-80fe-401a-abd2-1c47a9be42c4	Рестораны	expense	#eab308	utensils
6b539b0f-09ec-45d1-bc4e-59a1a6a6232e	71d4809f-80fe-401a-abd2-1c47a9be42c4	Развлечения	expense	#a855f7	gamepad
b23ec060-430d-47de-b9fb-94a223ab6a7a	71d4809f-80fe-401a-abd2-1c47a9be42c4	Здоровье	expense	#ec4899	heart
48124962-1010-4f52-9a5e-63483bd22afe	71d4809f-80fe-401a-abd2-1c47a9be42c4	Одежда	expense	#8b5cf6	shirt
f711707e-b9d7-42d3-ab9a-31c1ccf2eb8b	71d4809f-80fe-401a-abd2-1c47a9be42c4	Образование	expense	#06b6d4	book
39f8fcfd-cef5-4e57-a57c-14534cab77b9	71d4809f-80fe-401a-abd2-1c47a9be42c4	Зарплата	income	#22c55e	briefcase
b011293b-a511-44f7-92f7-1b952d8130ba	71d4809f-80fe-401a-abd2-1c47a9be42c4	Фриланс	income	#10b981	laptop
e1c81486-b1ec-4133-b104-e96df076b0af	71d4809f-80fe-401a-abd2-1c47a9be42c4	Подарки	income	#84cc16	gift
8da67c80-a1fb-4c7e-aac0-2644f2f1592d	71d4809f-80fe-401a-abd2-1c47a9be42c4	Инвестиции	income	#3b82f6	trending-up
e8a5c080-aa65-4075-9941-e27f1cfc7974	cf7389db-100b-4eb2-9ee9-f1798f34d406	Продукты	expense	#ef4444	shopping-cart
9e8bf34c-cf10-440f-ba20-c6670a701e20	cf7389db-100b-4eb2-9ee9-f1798f34d406	Транспорт	expense	#f97316	car
e4822920-83d5-455f-847a-1ce607b09640	cf7389db-100b-4eb2-9ee9-f1798f34d406	Рестораны	expense	#eab308	utensils
4068bc5a-9c13-4d1c-bfee-45200f9ce4e5	cf7389db-100b-4eb2-9ee9-f1798f34d406	Развлечения	expense	#a855f7	gamepad
2dc38294-be66-47e0-afee-8d474f7929dd	cf7389db-100b-4eb2-9ee9-f1798f34d406	Здоровье	expense	#ec4899	heart
f9a89f7d-3444-4aff-b304-5ef0b52eef93	cf7389db-100b-4eb2-9ee9-f1798f34d406	Коммунальные	expense	#14b8a6	home
802328b0-fa9d-449c-a35c-7a3e52aed8ee	cf7389db-100b-4eb2-9ee9-f1798f34d406	Одежда	expense	#8b5cf6	shirt
373e2e81-ac8f-4993-916b-857aedc3edfe	cf7389db-100b-4eb2-9ee9-f1798f34d406	Образование	expense	#06b6d4	book
a6eeabae-44be-4584-9c39-6e11f6bf92aa	cf7389db-100b-4eb2-9ee9-f1798f34d406	Зарплата	income	#22c55e	briefcase
d42ca44e-5b51-4c72-b82d-73610b7964c5	cf7389db-100b-4eb2-9ee9-f1798f34d406	Фриланс	income	#10b981	laptop
d69ee349-5da4-4003-aee4-e78a3224de2b	cf7389db-100b-4eb2-9ee9-f1798f34d406	Подарки	income	#84cc16	gift
a216dff2-d358-47d1-b85f-b21796832737	cf7389db-100b-4eb2-9ee9-f1798f34d406	Инвестиции	income	#3b82f6	trending-up
fb5e96e3-b7b1-4233-b6ae-386ece81a695	db072db6-6367-41a5-b487-eee0cf2b2d42	свет	expense	#eab308	star
ca51fbfd-9b99-447c-89f8-79a749d16dad	aee73495-c6de-41ed-b473-f816542e5f67	Транспорт	expense	#f97316	car
e16185e4-f79e-4b86-86ab-6e2ea48a9eb0	aee73495-c6de-41ed-b473-f816542e5f67	Фриланс	income	#10b981	laptop
e63f9f46-2c46-48dc-bffc-ba88ce05c0f1	aee73495-c6de-41ed-b473-f816542e5f67	Бессмысленная трата	expense	#ef4444	tag
e04b05c8-2d56-4f5e-9e17-e8dad2144ed5	aee73495-c6de-41ed-b473-f816542e5f67	Инвестиции	income	#3b82f6	trending-up
78b5ed62-2043-47ae-9c26-5646db87652d	aee73495-c6de-41ed-b473-f816542e5f67	Здоровье	expense	#ec4899	heart
354666a8-050e-4270-8296-3837ff6abe84	aee73495-c6de-41ed-b473-f816542e5f67	Пассивный доход	income	#84cc16	dollar
7ed4cd3c-9eb8-484f-b189-0f847a2a3634	71d4809f-80fe-401a-abd2-1c47a9be42c4	Коммунальные	expense	#14b8a6	home
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: finance_user
--

COPY public.transactions (id, account_id, category_id, amount, type, description, transaction_date, created_at) FROM stdin;
4230f1c0-867f-4667-844b-2ea259457a8a	b6114a50-c1ef-4cdd-8b4d-78f73351f407	d83e5780-997b-4e38-a861-8e9af9d3b306	1500.00	expense	�������	2026-04-13	2026-04-15 12:51:14.787803+05
578f91aa-0cd1-4219-8e66-1e09998d3ebd	b6114a50-c1ef-4cdd-8b4d-78f73351f407	ac9b3ecd-3b14-4088-80a7-74de55381bc0	50000.00	income	�������� ������	2026-04-01	2026-04-15 12:51:22.20182+05
77ea97f1-6436-4e3c-b588-97b8ffabecff	6468e111-7b7c-49db-ad0a-0d4648e3612b	1d790bed-e803-4e65-baf7-99af80f17e46	1000.00	income	\N	2026-05-07	2026-05-08 03:59:07.918778+05
7dbd453e-278b-4206-b4c8-7f5e64a09672	6468e111-7b7c-49db-ad0a-0d4648e3612b	76cc68dd-fb41-4742-9b29-892a280c7cbf	500.00	expense	\N	2026-05-09	2026-05-09 16:55:03.936793+05
0a7bc538-3558-4f28-8bce-6f1675f449c3	6468e111-7b7c-49db-ad0a-0d4648e3612b	5948f3e1-3cd2-4579-b63a-19b3b9a07526	271.00	expense	\N	2026-05-09	2026-05-09 16:55:25.570731+05
1f11bfe7-04be-4184-8a5e-021bfd4205b3	6468e111-7b7c-49db-ad0a-0d4648e3612b	e16185e4-f79e-4b86-86ab-6e2ea48a9eb0	5000.00	income	\N	2026-05-09	2026-05-09 22:16:21.050493+05
6e4e690e-0b8b-45cc-9174-7b1f6e4e338d	6468e111-7b7c-49db-ad0a-0d4648e3612b	ca51fbfd-9b99-447c-89f8-79a749d16dad	300.00	expense	\N	2026-05-09	2026-05-09 22:17:03.174568+05
7f976721-9f56-498c-82f0-9ba78469e8ce	6468e111-7b7c-49db-ad0a-0d4648e3612b	76cc68dd-fb41-4742-9b29-892a280c7cbf	1250.00	expense	\N	2026-05-09	2026-05-09 22:17:41.376541+05
3820b41d-3c4c-428d-8bef-a0b79970c57b	6468e111-7b7c-49db-ad0a-0d4648e3612b	efd2a87c-88e9-4ecc-b2fd-0236733838d3	3000.00	expense	\N	2026-05-09	2026-05-09 22:18:06.680948+05
ac6c2d63-d0e2-476e-a65c-aaf21dc7fb86	6468e111-7b7c-49db-ad0a-0d4648e3612b	\N	300.00	expense	\N	2026-05-10	2026-05-10 11:55:33.013168+05
c7fe1a6e-751c-429a-8cdf-643fdf83a797	71220141-b31d-42a0-9254-dfc3adf9557b	97a026d9-3d0f-49e8-beca-2a9705a6650d	5000.00	income	\N	2026-05-10	2026-05-10 15:25:02.047473+05
555bf468-aab0-419f-96fb-446c491c6457	71220141-b31d-42a0-9254-dfc3adf9557b	f03c9d6c-ebea-43c3-8eea-fed45c0ffa18	1000.00	expense	\N	2026-05-10	2026-05-10 15:25:19.268578+05
f14234e2-4ff0-450a-a067-3fc38fa5db7b	71220141-b31d-42a0-9254-dfc3adf9557b	c81c7956-43bf-4346-9738-f3fef55a7d91	600.00	expense	\N	2026-05-10	2026-05-10 15:25:32.123336+05
26b28787-b594-4cc0-8053-d476e869bf70	71220141-b31d-42a0-9254-dfc3adf9557b	97a026d9-3d0f-49e8-beca-2a9705a6650d	5000.00	income	\N	2026-05-12	2026-05-12 10:12:02.627072+05
012f6ea0-75fd-48d4-8823-b43bc0f1191f	71220141-b31d-42a0-9254-dfc3adf9557b	16286aa0-704d-466b-8fec-63468a4423db	500.00	expense	\N	2026-05-13	2026-05-13 09:24:27.169327+05
771fe1d6-d573-4c54-b8a9-971629197960	71220141-b31d-42a0-9254-dfc3adf9557b	\N	5.56	expense	\N	2026-05-13	2026-05-13 09:31:40.648697+05
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: finance_user
--

COPY public.users (id, email, password_hash, full_name, created_at) FROM stdin;
166d8d80-d468-4b6c-81fe-c4f3481c874f	test@test.com	$2b$12$wpwlET0/c4WQStLS7TbnIujLJ5h0cNClgub0cjBnkNhnMfvaQy/G.	Test User	2026-04-09 15:11:32.602925+05
db072db6-6367-41a5-b487-eee0cf2b2d42	md12370@auca.kg	$2b$12$QHrheYX5.jdmhLxwosPdpustPYIvNTQYm0nRHJk8PvGHZABzAGcaa	Daniel Muratbekov	2026-04-30 14:27:52.410284+05
aee73495-c6de-41ed-b473-f816542e5f67	dmuratbekov4@gmail.com	$2b$12$pE26ICONV9KLc3S5Q9TCZORjFVeD2DqrBoghHWFmtl81HmAi3GP8a	Даниэл Муратбеков	2026-05-05 15:28:37.080526+05
71d4809f-80fe-401a-abd2-1c47a9be42c4	szmovkurut@gmail.com	$2b$12$xV6ocJ9BAEUVRKGVeTQ1P.9VXTM4JH6OMRkYwYx5aze.ZSnc6eP7O	Даниэл Муратбеков	2026-05-07 02:32:29.275901+05
cf7389db-100b-4eb2-9ee9-f1798f34d406	example@email.com	$2b$12$d/0hCHBXTInxKBDImNSAO.oTR.oPhhHxLZ5Ad39P/DSBRCrHxbsd.	Иван	2026-05-09 22:27:13.415845+05
\.


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: finance_user
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: finance_user
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: finance_user
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: categories uq_category_name; Type: CONSTRAINT; Schema: public; Owner: finance_user
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT uq_category_name UNIQUE (user_id, name, type);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: finance_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: finance_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_accounts_user_id; Type: INDEX; Schema: public; Owner: finance_user
--

CREATE INDEX idx_accounts_user_id ON public.accounts USING btree (user_id);


--
-- Name: idx_categories_user_id; Type: INDEX; Schema: public; Owner: finance_user
--

CREATE INDEX idx_categories_user_id ON public.categories USING btree (user_id);


--
-- Name: idx_transactions_account_id; Type: INDEX; Schema: public; Owner: finance_user
--

CREATE INDEX idx_transactions_account_id ON public.transactions USING btree (account_id);


--
-- Name: idx_transactions_date; Type: INDEX; Schema: public; Owner: finance_user
--

CREATE INDEX idx_transactions_date ON public.transactions USING btree (transaction_date DESC);


--
-- Name: idx_transactions_type; Type: INDEX; Schema: public; Owner: finance_user
--

CREATE INDEX idx_transactions_type ON public.transactions USING btree (type);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: finance_user
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: accounts accounts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: finance_user
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: categories categories_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: finance_user
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: transactions transactions_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: finance_user
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: transactions transactions_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: finance_user
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO finance_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO finance_user;


--
-- PostgreSQL database dump complete
--

\unrestrict yP2pI4DlIZf94h6LuNrE8bLXGTd54fTUdCIu6n4Crceb4zbAWgi2uNaz2hKQShq

