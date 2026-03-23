-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "adverbsTrainings" TIMESTAMP(3)[],
ADD COLUMN     "genitiveTrainings" TIMESTAMP(3)[],
ADD COLUMN     "stressTrainings" TIMESTAMP(3)[],
ADD COLUMN     "trickyTrainings" TIMESTAMP(3)[];
