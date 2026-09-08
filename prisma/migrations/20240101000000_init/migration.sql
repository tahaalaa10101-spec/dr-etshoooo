-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'student',
    "tokenVersion" INTEGER NOT NULL DEFAULT 0,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicYear" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcademicYear_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Semester" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "academicYearId" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Semester_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "image" TEXT,
    "semesterId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "subjectId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lecture" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "videoUrl" TEXT,
    "pdfUrl" TEXT,
    "thumbnail" TEXT,
    "topicId" TEXT NOT NULL,
    "duration" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lecture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mcq" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "explanation" TEXT,
    "difficulty" TEXT NOT NULL DEFAULT 'medium',
    "topicId" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mcq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Essay" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "modelAnswer" TEXT NOT NULL,
    "explanation" TEXT,
    "difficulty" TEXT NOT NULL DEFAULT 'medium',
    "topicId" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Essay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "topicId" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicalCase" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "patientInfo" TEXT NOT NULL,
    "symptoms" TEXT NOT NULL,
    "signs" TEXT,
    "investigations" TEXT,
    "differentialDiag" TEXT,
    "finalDiagnosis" TEXT,
    "management" TEXT,
    "topicId" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicalCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flashcard" (
    "id" TEXT NOT NULL,
    "front" TEXT NOT NULL,
    "back" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Flashcard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exam" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "duration" INTEGER,
    "questionCount" INTEGER,
    "topicId" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalTerm" (
    "id" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "arabicTerm" TEXT,
    "latinTerm" TEXT,
    "definition" TEXT NOT NULL,
    "simpleExplanation" TEXT,
    "arabicMeaning" TEXT,
    "pronunciation" TEXT,
    "clinicalRelevance" TEXT,
    "relatedTerms" TEXT,
    "subjectId" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicalTerm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalApp" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "imageUrl" TEXT,
    "features" TEXT,
    "isFree" BOOLEAN NOT NULL DEFAULT true,
    "howToUse" TEXT,
    "officialUrl" TEXT,
    "platform" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicalApp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HowToStudy" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "subjectId" TEXT,
    "content" TEXT,
    "videoUrl" TEXT,
    "tips" TEXT,
    "studyMethod" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HowToStudy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Completion" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lectureId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Completion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizResult" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mcqId" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'info',
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "AcademicYear_slug_key" ON "AcademicYear"("slug");

-- CreateIndex
CREATE INDEX "AcademicYear_slug_idx" ON "AcademicYear"("slug");

-- CreateIndex
CREATE INDEX "AcademicYear_order_idx" ON "AcademicYear"("order");

-- CreateIndex
CREATE INDEX "AcademicYear_published_idx" ON "AcademicYear"("published");

-- CreateIndex
CREATE INDEX "Semester_academicYearId_idx" ON "Semester"("academicYearId");

-- CreateIndex
CREATE INDEX "Semester_order_idx" ON "Semester"("order");

-- CreateIndex
CREATE INDEX "Semester_published_idx" ON "Semester"("published");

-- CreateIndex
CREATE UNIQUE INDEX "Semester_academicYearId_slug_key" ON "Semester"("academicYearId", "slug");

-- CreateIndex
CREATE INDEX "Subject_semesterId_idx" ON "Subject"("semesterId");

-- CreateIndex
CREATE INDEX "Subject_slug_idx" ON "Subject"("slug");

-- CreateIndex
CREATE INDEX "Subject_order_idx" ON "Subject"("order");

-- CreateIndex
CREATE INDEX "Subject_published_idx" ON "Subject"("published");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_semesterId_slug_key" ON "Subject"("semesterId", "slug");

-- CreateIndex
CREATE INDEX "Topic_subjectId_idx" ON "Topic"("subjectId");

-- CreateIndex
CREATE INDEX "Topic_slug_idx" ON "Topic"("slug");

-- CreateIndex
CREATE INDEX "Topic_order_idx" ON "Topic"("order");

-- CreateIndex
CREATE INDEX "Topic_published_idx" ON "Topic"("published");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_subjectId_slug_key" ON "Topic"("subjectId", "slug");

-- CreateIndex
CREATE INDEX "Lecture_topicId_idx" ON "Lecture"("topicId");

-- CreateIndex
CREATE INDEX "Lecture_slug_idx" ON "Lecture"("slug");

-- CreateIndex
CREATE INDEX "Lecture_order_idx" ON "Lecture"("order");

-- CreateIndex
CREATE INDEX "Lecture_published_idx" ON "Lecture"("published");

-- CreateIndex
CREATE UNIQUE INDEX "Lecture_topicId_slug_key" ON "Lecture"("topicId", "slug");

-- CreateIndex
CREATE INDEX "Mcq_topicId_idx" ON "Mcq"("topicId");

-- CreateIndex
CREATE INDEX "Mcq_difficulty_idx" ON "Mcq"("difficulty");

-- CreateIndex
CREATE INDEX "Mcq_published_idx" ON "Mcq"("published");

-- CreateIndex
CREATE INDEX "Essay_topicId_idx" ON "Essay"("topicId");

-- CreateIndex
CREATE INDEX "Essay_difficulty_idx" ON "Essay"("difficulty");

-- CreateIndex
CREATE INDEX "Essay_published_idx" ON "Essay"("published");

-- CreateIndex
CREATE INDEX "Note_topicId_idx" ON "Note"("topicId");

-- CreateIndex
CREATE INDEX "Note_category_idx" ON "Note"("category");

-- CreateIndex
CREATE INDEX "Note_published_idx" ON "Note"("published");

-- CreateIndex
CREATE INDEX "ClinicalCase_topicId_idx" ON "ClinicalCase"("topicId");

-- CreateIndex
CREATE INDEX "ClinicalCase_published_idx" ON "ClinicalCase"("published");

-- CreateIndex
CREATE INDEX "Flashcard_topicId_idx" ON "Flashcard"("topicId");

-- CreateIndex
CREATE INDEX "Flashcard_published_idx" ON "Flashcard"("published");

-- CreateIndex
CREATE INDEX "Exam_topicId_idx" ON "Exam"("topicId");

-- CreateIndex
CREATE INDEX "Exam_published_idx" ON "Exam"("published");

-- CreateIndex
CREATE INDEX "MedicalTerm_term_idx" ON "MedicalTerm"("term");

-- CreateIndex
CREATE INDEX "MedicalTerm_arabicTerm_idx" ON "MedicalTerm"("arabicTerm");

-- CreateIndex
CREATE INDEX "MedicalTerm_latinTerm_idx" ON "MedicalTerm"("latinTerm");

-- CreateIndex
CREATE INDEX "MedicalTerm_subjectId_idx" ON "MedicalTerm"("subjectId");

-- CreateIndex
CREATE INDEX "MedicalTerm_published_idx" ON "MedicalTerm"("published");

-- CreateIndex
CREATE INDEX "MedicalApp_category_idx" ON "MedicalApp"("category");

-- CreateIndex
CREATE INDEX "MedicalApp_published_idx" ON "MedicalApp"("published");

-- CreateIndex
CREATE UNIQUE INDEX "HowToStudy_slug_key" ON "HowToStudy"("slug");

-- CreateIndex
CREATE INDEX "HowToStudy_subjectId_idx" ON "HowToStudy"("subjectId");

-- CreateIndex
CREATE INDEX "HowToStudy_slug_idx" ON "HowToStudy"("slug");

-- CreateIndex
CREATE INDEX "HowToStudy_published_idx" ON "HowToStudy"("published");

-- CreateIndex
CREATE INDEX "Favorite_userId_idx" ON "Favorite"("userId");

-- CreateIndex
CREATE INDEX "Favorite_itemType_itemId_idx" ON "Favorite"("itemType", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userTypeItem_key" ON "Favorite"("userId", "itemType", "itemId");

-- CreateIndex
CREATE INDEX "Bookmark_userId_idx" ON "Bookmark"("userId");

-- CreateIndex
CREATE INDEX "Bookmark_itemType_itemId_idx" ON "Bookmark"("itemType", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_userTypeItem_key" ON "Bookmark"("userId", "itemType", "itemId");

-- CreateIndex
CREATE INDEX "Progress_userId_idx" ON "Progress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Progress_userSubject_key" ON "Progress"("userId", "subjectId");

-- CreateIndex
CREATE INDEX "Completion_userId_idx" ON "Completion"("userId");

-- CreateIndex
CREATE INDEX "Completion_lectureId_idx" ON "Completion"("lectureId");

-- CreateIndex
CREATE UNIQUE INDEX "Completion_userLecture_key" ON "Completion"("userId", "lectureId");

-- CreateIndex
CREATE INDEX "QuizResult_userId_idx" ON "QuizResult"("userId");

-- CreateIndex
CREATE INDEX "QuizResult_mcqId_idx" ON "QuizResult"("mcqId");

-- CreateIndex
CREATE INDEX "Notification_read_idx" ON "Notification"("read");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");
