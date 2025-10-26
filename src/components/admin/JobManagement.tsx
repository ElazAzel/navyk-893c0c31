import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const JobManagement = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    company: string;
    description: string;
    location: string;
    job_type: "full_time" | "part_time" | "contract" | "internship";
    salary_min: number;
    salary_max: number;
  }>({
    title: "",
    company: "",
    description: "",
    location: "Москва",
    job_type: "full_time",
    salary_min: 0,
    salary_max: 0,
  });

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Ошибка загрузки вакансий");
      return;
    }
    setJobs(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("jobs").insert([formData]);

    if (error) {
      toast.error("Ошибка создания вакансии");
      console.error(error);
    } else {
      toast.success("Вакансия успешно создана");
      setFormData({
        title: "",
        company: "",
        description: "",
        location: "Москва",
        job_type: "full_time",
        salary_min: 0,
        salary_max: 0,
      });
      loadJobs();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить вакансию?")) return;

    const { error } = await supabase.from("jobs").delete().eq("id", id);

    if (error) {
      toast.error("Ошибка удаления вакансии");
    } else {
      toast.success("Вакансия удалена");
      loadJobs();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Создать новую вакансию
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Название должности</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Компания</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Локация</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="job_type">Тип занятости</Label>
                <Select
                  value={formData.job_type}
                  onValueChange={(value: any) => setFormData({ ...formData, job_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_time">Полная занятость</SelectItem>
                    <SelectItem value="part_time">Частичная занятость</SelectItem>
                    <SelectItem value="contract">Контракт</SelectItem>
                    <SelectItem value="internship">Стажировка</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary_min">Зарплата от (₽)</Label>
                <Input
                  id="salary_min"
                  type="number"
                  value={formData.salary_min}
                  onChange={(e) => setFormData({ ...formData, salary_min: parseInt(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary_max">Зарплата до (₽)</Label>
                <Input
                  id="salary_max"
                  type="number"
                  value={formData.salary_max}
                  onChange={(e) => setFormData({ ...formData, salary_max: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                required
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Создание..." : "Создать вакансию"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Список вакансий ({jobs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Должность</TableHead>
                  <TableHead>Компания</TableHead>
                  <TableHead>Локация</TableHead>
                  <TableHead>Зарплата</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.company}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>
                      {job.salary_min && job.salary_max
                        ? `${job.salary_min} - ${job.salary_max} ₽`
                        : "Не указана"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(job.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobManagement;
