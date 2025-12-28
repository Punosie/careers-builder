CREATE TABLE public.company (
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user uuid NOT NULL UNIQUE,
  logo text,
  updated_at timestamp with time zone,
  theme jsonb,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  banner text,
  short_description text,
  long_description text,
  life_at_company text,
  benefits text,
  CONSTRAINT company_pkey PRIMARY KEY (id),
  CONSTRAINT company_user_fkey FOREIGN KEY (user) REFERENCES auth.users(id)
);
CREATE TABLE public.jobs (
  title text,
  description text,
  location text,
  employment_type text,
  is_remote boolean NOT NULL,
  department text,
  skills ARRAY,
  last_application_date date,
  assignment_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  company uuid,
  salary_range text,
  job_slug text,
  experience_level text,
  applications ARRAY,
  CONSTRAINT jobs_pkey PRIMARY KEY (id),
  CONSTRAINT jobs_company_fkey FOREIGN KEY (company) REFERENCES public.company(id)
);
CREATE TABLE public.pageLayout (
  layout_order jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  company uuid UNIQUE,
  CONSTRAINT pageLayout_pkey PRIMARY KEY (id),
  CONSTRAINT pageLayout_company_fkey FOREIGN KEY (company) REFERENCES public.company(id)
);