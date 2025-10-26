import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useRatings } from "@/hooks/useRatings";

interface RatingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentType: "course" | "event" | "job";
  contentId: string;
  title: string;
}

export const RatingDialog = ({
  open,
  onOpenChange,
  contentType,
  contentId,
  title,
}: RatingDialogProps) => {
  const { userRating, submitRating } = useRatings(contentType, contentId);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    if (userRating) {
      setRating(userRating.rating);
      setReview(userRating.review || "");
    }
  }, [userRating]);

  const handleSubmit = async () => {
    if (rating > 0) {
      await submitRating(rating, review);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Оцените {title}</DialogTitle>
          <DialogDescription>
            Ваш отзыв поможет другим пользователям
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                onMouseEnter={() => setHoveredRating(value)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`h-8 w-8 ${
                    value <= (hoveredRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>

          <Textarea
            placeholder="Напишите ваш отзыв (необязательно)"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={4}
          />

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={rating === 0}
              className="flex-1"
            >
              Отправить
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
