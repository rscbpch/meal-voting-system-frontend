import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../../components/SideBar";
import PageTransition from "../../components/PageTransition";
import Loading from "../../components/Loading";
import DatePicker from "../../components/DatePicker";
import CustomAlert from "../../components/CustomAlert";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import {
  PlusIcon,
  XMarkIcon,
  CheckIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { PiBowlFood } from "react-icons/pi";
import { getCategories, getDishes } from "../../services/dishService";
import { submitVotePoll, getPendingVotePoll, deleteVotePoll, editVotePoll, type PendingVotePollResponse } from "../../services/votePollService";
import type { Category, Dish } from "../../services/dishService";

const FoodForVoter = () => {
  const [searchParams] = useSearchParams();
  const [hasFood, setHasFood] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalStep, setModalStep] = useState<"category" | "dishes">("category");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedDishes, setSelectedDishes] = useState<Set<number | string>>(
    new Set()
  );
  const [allSelectedDishes, setAllSelectedDishes] = useState<Dish[]>([]);
  const [categoriesWithSelections, setCategoriesWithSelections] = useState<
    Set<number | string>
  >(new Set());
  const [pendingVotePoll, setPendingVotePoll] = useState<PendingVotePollResponse | null>(null);
  const [isLoadingPendingPoll, setIsLoadingPendingPoll] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalDishes, setOriginalDishes] = useState<Dish[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedDate, setSelectedDateState] = useState<string>(() => {
    // Check if date is provided in URL parameters
    const urlDate = searchParams.get('date');
    if (urlDate) {
      return urlDate;
    }

    // Check if date is stored in localStorage
    const storedDate = localStorage.getItem('selectedMealDate');
    if (storedDate) {
      return storedDate;
    }

    // Default behavior when no date is provided from route or localStorage
    const now = new Date();
    const currentHour = now.getHours();

    // If current time is before 6am, default to tomorrow
    // If current time is after 6am, default to day after tomorrow
    const targetDate = new Date(now);
    if (currentHour < 6) {
      targetDate.setDate(now.getDate() + 1); // Tomorrow
    } else {
      targetDate.setDate(now.getDate() + 2); // Day after tomorrow
    }

    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, "0");
    const day = String(targetDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });

  // Custom setter that also saves to localStorage
  const setSelectedDate = (date: string) => {
    setSelectedDateState(date);
    localStorage.setItem('selectedMealDate', date);
  };
  const [timeRemaining, setTimeRemaining] = useState<string>("00:00:00");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [alert, setAlert] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "warning" | "info";
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Function to refresh pending vote poll data
  const refreshPendingVotePoll = async () => {
    try {
      setIsLoadingPendingPoll(true);
      console.log("Refreshing pending vote poll for date:", selectedDate);
      const pendingPoll = await getPendingVotePoll(selectedDate);
      console.log("Refreshed pending poll response:", pendingPoll);
      setPendingVotePoll(pendingPoll);
      
      // Convert pending poll dishes to Dish format and set as selected dishes
      const pendingDishes: Dish[] = pendingPoll.dishes.map(dish => ({
        id: dish.dishId,
        name: dish.name,
        name_kh: dish.name_kh,
        description: dish.description,
        description_kh: dish.description_kh,
        imageURL: dish.imageURL,
        categoryId: dish.categoryId,
        price: undefined, // Not available in pending poll response
        rating: undefined, // Not available in pending poll response
      }));
      
      setAllSelectedDishes(pendingDishes);
      setOriginalDishes([...pendingDishes]); // Store original dishes for edit mode
      setIsEditMode(false); // Reset edit mode when loading new data
      
      // Track categories that have selections
      const categoryIds = new Set(pendingDishes.map(dish => dish.categoryId).filter((id): id is number | string => Boolean(id)));
      setCategoriesWithSelections(categoryIds);
      
    } catch (error: any) {
      console.error("Error refreshing pending vote poll for date", selectedDate, ":", error);
      // If no pending poll exists, clear all state
      setPendingVotePoll(null);
      setAllSelectedDishes([]);
      setCategoriesWithSelections(new Set());
      setOriginalDishes([]);
      setIsEditMode(false);
      console.log("Cleared all state for date:", selectedDate);
    } finally {
      setIsLoadingPendingPoll(false);
    }
  };

  // Fetch pending vote poll when component mounts
  useEffect(() => {
    refreshPendingVotePoll();
  }, [selectedDate]);

  // Handle URL parameter changes
  useEffect(() => {
    const urlDate = searchParams.get('date');
    if (urlDate && urlDate !== selectedDate) {
      setSelectedDateState(urlDate);
      localStorage.setItem('selectedMealDate', urlDate);
    }
  }, [searchParams, selectedDate]);

  // Update hasFood based on selected dishes
  useEffect(() => {
    setHasFood(allSelectedDishes.length > 0);
  }, [allSelectedDishes]);

  // Track unsaved changes in edit mode
  useEffect(() => {
    if (isEditMode) {
      const hasChanges = checkForUnsavedChanges();
      setHasUnsavedChanges(hasChanges);
    }
  }, [allSelectedDishes, isEditMode, originalDishes]);

  // Calculate time remaining until 6 AM of the day before the selected date
  const calculateTimeRemaining = () => {
    const now = new Date();
    const selectedDateObj = new Date(selectedDate + "T00:00:00"); // Ensure consistent date parsing
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate the deadline: 6 AM of the day BEFORE the selected date
    const dayBeforeSelected = new Date(selectedDateObj);
    dayBeforeSelected.setDate(selectedDateObj.getDate() - 1);
    const deadline = new Date(dayBeforeSelected);
    deadline.setHours(6, 0, 0, 0);

    // If the selected date is today or in the past, deadline has passed
    if (selectedDateObj <= today) {
      return "00:00:00";
    }

    // If the selected date is tomorrow and it's past 6 AM today, deadline has passed
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (
      selectedDateObj.getTime() === tomorrow.getTime() &&
      now.getHours() >= 6
    ) {
      return "00:00:00";
    }

    // If deadline has passed, show 00:00:00
    if (now >= deadline) {
      return "00:00:00";
    }

    // Calculate time until 6 AM of the day before the selected date
    const timeDiff = deadline.getTime() - now.getTime();
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    if (days > 0) {
      return `${days}d ${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Update countdown every second
  useEffect(() => {
    const updateCountdown = () => {
      setTimeRemaining(calculateTimeRemaining());
    };

    updateCountdown(); // Initial update
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [selectedDate]);

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showDatePicker && !target.closest(".date-picker-container")) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDatePicker]);

  // Check if selected date is weekend (Saturday or Sunday)
  const isWeekend = (dateString: string) => {
    const date = new Date(dateString);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // 0 = Sunday, 6 = Saturday
  };

  // Check if add food button should be disabled (weekend, time expired, poll not pending, or not in edit mode)
  const isAddFoodDisabled = () => {
    // Check if selected date is weekend
    if (isWeekend(selectedDate)) {
      return true;
    }

    // Check if countdown time is expired (00:00:00)
    if (timeRemaining === "00:00:00") {
      return true;
    }

    // Check if there's a pending poll but it's not in pending status
    if (pendingVotePoll && pendingVotePoll.status !== "pending") {
      return true;
    }

    // If there are existing dishes and not in edit mode, disable add food
    if (pendingVotePoll && !isEditMode) {
      return true;
    }

    return false;
  };

  // Check if submit should be disabled (only for time and weekend, not dish count)
  const isSubmitDisabled = () => {
    // Check if selected date is weekend
    if (isWeekend(selectedDate)) {
      return true;
    }

    // Check if countdown time is expired (00:00:00)
    if (timeRemaining === "00:00:00") {
      return true;
    }

    // Check if there's a pending poll but it's not in pending status
    if (pendingVotePoll && pendingVotePoll.status !== "pending") {
      return true;
    }

    return false;
  };

  // Helper function to show custom alert
  const showAlert = (
    title: string,
    message: string,
    type: "success" | "error" | "warning" | "info"
  ) => {
    setAlert({
      isOpen: true,
      title,
      message,
      type,
    });
  };

  const closeAlert = () => {
    setAlert((prev) => ({ ...prev, isOpen: false }));
  };

  // Check if there are unsaved changes
  const checkForUnsavedChanges = () => {
    if (!isEditMode || !originalDishes.length) return false;
    
    // Compare current dishes with original dishes
    if (allSelectedDishes.length !== originalDishes.length) return true;
    
    // Check if any dish IDs are different
    const currentIds = new Set(allSelectedDishes.map(dish => dish.id).sort());
    const originalIds = new Set(originalDishes.map(dish => dish.id).sort());
    
    return !(currentIds.size === originalIds.size && 
             [...currentIds].every(id => originalIds.has(id)));
  };

  // Handle edit mode
  const handleEditMode = () => {
    setIsEditMode(true);
    setHasUnsavedChanges(false); // Reset unsaved changes flag when entering edit mode
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    // Check if minimum 3 dishes are selected
    if (allSelectedDishes.length < 3) {
      showAlert(
        "Insufficient Dishes",
        `Please select at least 3 dishes before saving. Currently selected: ${allSelectedDishes.length} dishes.`,
        "warning"
      );
      return;
    }

    // Check if weekend
    if (isWeekend(selectedDate)) {
      showAlert(
        "Weekend Not Allowed",
        "Food submission is not allowed on weekends (Saturday and Sunday). Please select a weekday.",
        "error"
      );
      return;
    }

    // Check if countdown time has expired
    if (timeRemaining === "00:00:00") {
      showAlert(
        "Time Expired",
        "Submission time has expired. You can only submit food before 6:00 AM on the day before the selected meal date.",
        "error"
      );
      return;
    }

    // Check if we have a pending vote poll to edit
    if (!pendingVotePoll) {
      showAlert(
        "No Vote Poll Found",
        "No pending vote poll found to edit. Please create a new vote poll first.",
        "error"
      );
      return;
    }

    const editData = {
      dishIds: allSelectedDishes.map((dish) => dish.id),
    };

    try {
      setLoading(true);
      console.log("Editing vote poll data:", editData);
      console.log("Vote poll ID:", pendingVotePoll.votePollId);
      
      const response = await editVotePoll(pendingVotePoll.votePollId, editData);
      console.log("Edit response:", response);
      
      // Check if the response indicates success
      // The response should have a success property or the API call itself succeeding indicates success
      if (response && (response.success === true || response.success === undefined)) {
        showAlert(
          "Update Successful",
          `Food updated for ${selectedDate}! ${allSelectedDishes.length} dishes selected.`,
          "success"
        );
        
        // Exit edit mode and reset unsaved changes flag
        setIsEditMode(false);
        setHasUnsavedChanges(false);
        
        // Refresh data from backend to ensure UI is in sync
        await refreshPendingVotePoll();
      } else {
        showAlert(
          "Update Failed",
          response?.message || "Failed to update food. Please try again.",
          "error"
        );
      }
    } catch (error: any) {
      console.error("Error updating food:", error);
      showAlert(
        "Update Failed",
        error.message || "An error occurred while updating food. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    // Check if there are unsaved changes
    if (hasUnsavedChanges) {
      setShowCancelConfirmation(true);
      return;
    }
    
    // If no changes, proceed with cancel
    performCancelEdit();
  };

  // Perform the actual cancel edit action
  const performCancelEdit = () => {
    // Restore original dishes
    setAllSelectedDishes([...originalDishes]);
    
    // Restore original categories
    const categoryIds = new Set(originalDishes.map(dish => dish.categoryId).filter((id): id is number | string => Boolean(id)));
    setCategoriesWithSelections(categoryIds);
    
    // Exit edit mode and reset unsaved changes flag
    setIsEditMode(false);
    setHasUnsavedChanges(false);
    setShowCancelConfirmation(false);
  };

  // Handle confirmation dialog actions
  const handleCancelConfirmation = () => {
    setShowCancelConfirmation(false);
  };

  const handleConfirmCancel = () => {
    performCancelEdit();
  };

  // Handle delete confirmation dialog actions
  const handleDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
  };

  const handleConfirmDelete = () => {
    performDeleteVotePoll();
  };

  // Handle delete vote poll - show confirmation dialog
  const handleDeleteVotePoll = () => {
    if (!pendingVotePoll) return;
    setShowDeleteConfirmation(true);
  };

  // Perform the actual delete action
  const performDeleteVotePoll = async () => {
    if (!pendingVotePoll) return;

    try {
      setIsDeleting(true);
      console.log("Deleting vote poll with ID:", pendingVotePoll.votePollId);
      
      const response = await deleteVotePoll(pendingVotePoll.votePollId);
      console.log("Delete response:", response);
      
      // Check if the response indicates success
      if (response && (response.success === true || response.success === undefined)) {
        // Clear all state after successful deletion
        setPendingVotePoll(null);
        setAllSelectedDishes([]);
        setCategoriesWithSelections(new Set());
        setOriginalDishes([]);
        setIsEditMode(false);
        setShowDeleteConfirmation(false);
      } else {
        // Show error alert only on failure
        showAlert(
          "Delete Failed",
          response?.message || "Failed to delete vote poll. Please try again.",
          "error"
        );
        setShowDeleteConfirmation(false);
      }
      
    } catch (error: any) {
      console.error("Error deleting vote poll:", error);
      // Show error alert only on failure
      showAlert(
        "Delete Failed",
        error.message || "An error occurred while deleting the vote poll. Please try again.",
        "error"
      );
      setShowDeleteConfirmation(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddFoodClick = () => {
    setShowCategoryModal(true);
    setModalStep("category");
    setSelectedCategory(null);
    setSelectedDishes(new Set());
  };

  const handleCategorySelect = async (category: Category) => {
    try {
      setLoading(true);
      setSelectedCategory(category);
      setModalStep("dishes");

      console.log("Fetching dishes for category:", category);

      // Fetch dishes directly by category
      const dishesData = await getDishes({
        categoryId: category.id,
      });
      console.log("Dishes for category", category.name, ":", dishesData);

      setDishes(dishesData.items);
    } catch (error) {
      console.error("Error fetching dishes:", error);
      setDishes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToCategories = () => {
    setModalStep("category");
    setSelectedCategory(null);
    setDishes([]);
    setSelectedDishes(new Set());
  };

  const handleDishSelect = (dishId: number | string) => {
    setSelectedDishes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dishId)) {
        newSet.delete(dishId);
      } else {
        newSet.add(dishId);
      }
      return newSet;
    });
  };

  const handleSubmitSelection = () => {
    console.log("Selected dishes:", Array.from(selectedDishes));

    // Get the selected dish objects
    const selectedDishObjects = dishes.filter((dish) =>
      selectedDishes.has(dish.id)
    );

    // Add to all selected dishes (avoid duplicates)
    setAllSelectedDishes((prev) => {
      const existingIds = new Set(prev.map((dish) => dish.id));
      const newDishes = selectedDishObjects.filter(
        (dish) => !existingIds.has(dish.id)
      );
      return [...prev, ...newDishes];
    });

    // Track category as having selections
    if (selectedCategory) {
      setCategoriesWithSelections(
        (prev) => new Set([...prev, selectedCategory.id])
      );
    }

    setShowCategoryModal(false);
    setModalStep("category");
    setSelectedCategory(null);
    setSelectedDishes(new Set());
    
    // Mark as having unsaved changes if in edit mode
    if (isEditMode) {
      setHasUnsavedChanges(true);
    }
  };

  const handleCloseModal = () => {
    setShowCategoryModal(false);
    setModalStep("category");
    setSelectedCategory(null);
    setDishes([]);
    setSelectedDishes(new Set());
  };

  const handleSubmitFood = async () => {
    // Check if minimum 3 dishes are selected
    if (allSelectedDishes.length < 3) {
      showAlert(
        "Insufficient Dishes",
        `Please select at least 3 dishes before submitting. Currently selected: ${allSelectedDishes.length} dishes.`,
        "warning"
      );
      return;
    }

    // Check if weekend
    if (isWeekend(selectedDate)) {
      showAlert(
        "Weekend Not Allowed",
        "Food submission is not allowed on weekends (Saturday and Sunday). Please select a weekday.",
        "error"
      );
      return;
    }

    // Check if countdown time has expired
    if (timeRemaining === "00:00:00") {
      showAlert(
        "Time Expired",
        "Submission time has expired. You can only submit food before 6:00 AM on the day before the selected meal date.",
        "error"
      );
      return;
    }

    const submitData = {
      mealDate: selectedDate,
      dishIds: allSelectedDishes.map((dish) => dish.id),
    };

    try {
      setLoading(true);
      console.log("Submitting food data:", submitData);
      
      const response = await submitVotePoll(submitData);
      console.log("Submit response:", response);
      
      // Check if the response indicates success
      // The response should have a success property or the API call itself succeeding indicates success
      if (response && (response.success === true || response.success === undefined)) {
        const actionText = pendingVotePoll ? "updated" : "submitted";
        showAlert(
          "Submission Successful",
          `Food ${actionText} for ${selectedDate}! ${allSelectedDishes.length} dishes selected.`,
          "success"
        );
        
        // Refresh data from backend to update UI state
        await refreshPendingVotePoll();
      } else {
        showAlert(
          "Submission Failed",
          response?.message || "Failed to submit food. Please try again.",
          "error"
        );
      }
    } catch (error: any) {
      console.error("Error submitting food:", error);
      showAlert(
        "Submission Failed",
        error.message || "An error occurred while submitting food. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 bg-[#F6FFE8] pb-20">
        <PageTransition>
          {/* Main Title with Shadow */}
          <div className="sticky bg-white shadow-sm p-6 mb-6">
            <h1 className="text-2xl font-semibold text-[#3A4038]">
              Food for vote
            </h1>
          </div>

          {/* Select Food Title, Date Selection and Action Buttons */}
          <div className="px-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#3A4038]">
                Selected food ({allSelectedDishes.length})
              </h2>
              <div className="flex items-center gap-4">
                {/* Date Selection */}
                <div className="relative date-picker-container">
                  <div
                    className="flex items-center justify-between gap-4 bg-white rounded-lg px-6 py-2 shadow-sm hover:bg-gray-50 transition-colors cursor-pointer h-[48px]"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                  >
                    <div className="flex flex-col">
                      <span className="text-[11px] text-gray-500">
                        Meal Date
                      </span>
                      <span className="text-sm font-bold text-gray-800">
                        {new Date(selectedDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <svg
                      className="w-5 h-5 text-[#429818] ml-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>

                  {/* Date Picker */}
                  <DatePicker
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                    showDatePicker={showDatePicker}
                    onClose={() => setShowDatePicker(false)}
                  />
                </div>

                {/* Countdown Timer */}
                <div
                  className={`flex items-center justify-between gap-4 bg-white rounded-lg px-6 py-2 shadow-sm hover:bg-gray-50 transition-colors h-[48px] ${
                    timeRemaining === "00:00:00"
                      ? "border border-red-200"
                      : "border border-[#AAD36C]"
                  }`}
                >
                  <div className="flex flex-col">
                    <span
                      className={`text-[11px] ${
                        timeRemaining === "00:00:00"
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      {timeRemaining === "00:00:00" ? "Expired" : "Time Left"}
                    </span>
                    <span
                      className={`text-sm font-bold font-mono ${
                        timeRemaining === "00:00:00"
                          ? "text-red-500"
                          : "text-[#429818]"
                      }`}
                    >
                      {timeRemaining}
                    </span>
                  </div>
                  <svg
                    className={`w-5 h-5 ${
                      timeRemaining === "00:00:00"
                        ? "text-red-500"
                        : "text-[#AAD36C]"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 transition-all duration-300">
                  {pendingVotePoll && !isEditMode ? (
                    // Show Edit and Delete buttons when there's a pending poll and not in edit mode
                    <div className="flex items-center gap-3 transition-all duration-300 ease-in-out">
                      <button
                        onClick={handleEditMode}
                        disabled={pendingVotePoll.status !== "pending" || timeRemaining === "00:00:00" || isWeekend(selectedDate)}
                        className={`px-6 h-[48px] rounded-lg transition-all duration-300 font-medium flex items-center gap-2 transform ${
                          pendingVotePoll.status === "pending" && timeRemaining !== "00:00:00" && !isWeekend(selectedDate)
                            ? "bg-[#429818] text-white hover:bg-[#3E7B27] cursor-pointer hover:scale-105"
                            : "bg-gray-400 text-white cursor-not-allowed"
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit 
                      </button>
                      <button
                        onClick={handleDeleteVotePoll}
                        disabled={pendingVotePoll.status !== "pending" || timeRemaining === "00:00:00" || isWeekend(selectedDate)}
                        className={`px-6 h-[48px] rounded-lg transition-all duration-300 font-medium flex items-center gap-2 transform ${
                          pendingVotePoll.status === "pending" && timeRemaining !== "00:00:00" && !isWeekend(selectedDate)
                            ? "bg-red-600 text-white hover:bg-red-700 cursor-pointer hover:scale-105"
                            : "bg-gray-400 text-white cursor-not-allowed"
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  ) : isEditMode ? (
                    // Show Save and Cancel buttons when in edit mode
                    <div className="flex items-center gap-3 transition-all duration-300 ease-in-out">
                      <button
                        onClick={handleSaveChanges}
                        disabled={isSubmitDisabled() || !hasFood || loading}
                        className={`px-6 h-[48px] rounded-lg transition-all duration-300 font-medium flex items-center gap-2 transform ${
                          !isSubmitDisabled() && hasFood && !loading
                            ? "bg-green-600 text-white hover:bg-green-700 cursor-pointer hover:scale-105"
                            : "bg-[#A3CFA0] text-white cursor-not-allowed"
                        }`}
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                            Save Changes
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={loading}
                        className="px-6 h-[48px] transition-all duration-300 font-medium flex items-center gap-2 bg-[#EEEEEE] text-[#888888] rounded-lg hover:bg-gray-200 hover:text-gray-600 transition-colors cursor-pointer transform hover:scale-105"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    // Show Submit button when no existing poll
                    <div className="flex items-center gap-3 transition-all duration-300 ease-in-out">
                      <button
                        onClick={handleSubmitFood}
                        disabled={isSubmitDisabled() || !hasFood || loading}
                        className={`px-6 h-[48px] rounded-lg transition-all duration-300 font-medium flex items-center gap-2 transform ${
                          !isSubmitDisabled() && hasFood && !loading
                            ? "bg-[#429818] text-white hover:bg-[#3E7B27] cursor-pointer hover:scale-105"
                            : "bg-[#A3CFA0] text-white cursor-not-allowed"
                        }`}
                      >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Submitting...
                        </>
                      ) : (
                        "Submit food"
                      )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Vote Poll Info */}
            {pendingVotePoll && !isEditMode && (
              <div className={`border rounded-lg p-3 mb-4 transition-all duration-300 ${
                pendingVotePoll.status === "pending" 
                  ? "bg-blue-50 border-blue-200" 
                  : "bg-gray-50 border-gray-200"
              }`}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    pendingVotePoll.status === "pending" 
                      ? "bg-blue-500" 
                      : "bg-gray-500"
                  }`}></div>
                  <p className={`text-sm ${
                    pendingVotePoll.status === "pending" 
                      ? "text-blue-700" 
                      : "text-gray-700"
                  }`}>
                    <span className="font-semibold">
                      {pendingVotePoll.status === "pending" 
                        ? "Pending Vote Poll: " 
                        : `Vote Poll (${pendingVotePoll.status}):`}
                    </span> 
                    Food selection for {new Date(pendingVotePoll.mealDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}. 
                    {pendingVotePoll.status === "pending" 
                      ? " You can add more dishes or modify the selection before the timer ends."
                      : " This poll is no longer accepting modifications."
                    }
                  </p>
                </div>
              </div>
            )}

            {/* Validation Warnings */}
            {isSubmitDisabled() && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                {isWeekend(selectedDate) ? (
                  <p className="text-sm text-red-600">
                    Food submission is not allowed on weekends (Saturday and
                    Sunday). Please select a weekday.
                  </p>
                ) : pendingVotePoll && pendingVotePoll.status !== "pending" ? (
                  <p className="text-sm text-red-600">
                    This vote poll is no longer in pending status ({pendingVotePoll.status}). 
                    You cannot add or modify food selections.
                  </p>
                ) : (
                  <p className="text-sm text-red-600">
                    Submission time has expired. You can only submit food before
                    6:00 AM on the day before the selected meal date.
                  </p>
                )}
              </div>
            )}

            {/* Edit Mode Info */}
            {isEditMode && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <p className="text-sm text-yellow-700">
                    <span className="font-semibold">Edit Mode:</span> You can now add, remove, or modify dishes. 
                    Click "Save Changes" to confirm your changes or "Cancel" to discard them.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Main Content Container */}
          <div className="px-6">
            {isLoadingPendingPoll ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 flex flex-col items-center justify-center">
                <div className="bg-white rounded-lg flex flex-col items-center justify-center w-full min-h-[400px]">
                  <Loading className="m-10" />
                  <p className="text-gray-500 mt-4">Loading pending vote poll...</p>
                </div>
              </div>
            ) : !hasFood ? (
              <div className=" border-2 border-dashed border-gray-300 rounded-lg p-2 flex flex-col items-center justify-center ">
                <div className="bg-white rounded-lg flex flex-col items-center justify-center w-full min-h-[400px]">
                  {/* Food Icon */}
                  <div className="mb-6">
                    <svg
                      width="143"
                      height="144"
                      viewBox="0 0 143 144"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_1385_7520)">
                        <path
                          d="M97.8554 91.288C97.8554 100.136 79.87 107.316 57.6794 107.316C35.4921 107.316 17.5 100.136 17.5 91.288C17.5 82.4287 35.4921 75.2534 57.6794 75.2534C79.87 75.2534 97.8554 82.4287 97.8554 91.288Z"
                          fill="#A6A8AB"
                        />
                        <path
                          d="M84.6997 109.739C106.888 109.739 124.876 102.563 124.876 93.7115C124.876 84.8595 106.888 77.6836 84.6997 77.6836C62.5111 77.6836 44.5237 84.8595 44.5237 93.7115C44.5237 102.563 62.5111 109.739 84.6997 109.739Z"
                          fill="#A6A8AB"
                        />
                        <path
                          d="M72.6425 104.248C55.6493 104.248 40.4112 100.543 30.0837 94.6802C29.9808 95.4716 29.9183 96.2715 29.9183 97.0832C29.9183 112.389 48.7491 124.797 71.9759 124.797C95.206 124.797 114.037 112.387 114.037 97.0832C114.036 96.5004 114.005 95.9239 113.944 95.3535C103.665 100.823 88.9623 104.248 72.6391 104.248"
                          fill="#D0D2D3"
                        />
                        <path
                          d="M51.0255 102.13C42.9171 100.466 35.7536 97.9048 30.087 94.6851C29.9841 95.4765 29.9216 96.2764 29.9216 97.0881C29.9216 112.394 48.7524 124.802 71.9792 124.802C73.8101 124.802 75.609 124.714 77.3826 124.566C63.2784 120.907 52.9037 112.389 51.0255 102.13Z"
                          fill="#B6B6B7"
                        />
                        <path
                          d="M118.952 83.7081C118.952 94.0541 97.9194 102.439 71.9893 102.439C46.0508 102.439 25.0228 94.0423 25.0228 83.7081C25.0228 73.3586 46.0508 64.96 71.9893 64.96C97.9194 64.96 118.952 73.3519 118.952 83.7081Z"
                          fill="#D0D2D3"
                        />
                        <path
                          d="M71.6519 99.0151C93.8414 99.0151 111.83 91.8369 111.83 82.9822C111.83 74.1274 93.8414 66.9492 71.6519 66.9492C49.4624 66.9492 31.4742 74.1274 31.4742 82.9822C31.4742 91.8369 49.4624 99.0151 71.6519 99.0151Z"
                          fill="#A6A8AB"
                        />
                        <path
                          d="M40.72 70.2263C37.8107 72.7964 34.7614 75.1775 31.7442 77.6176C29.0593 79.781 32.4883 83.7567 35.3031 82.2228C37.9288 80.8002 40.5343 79.4047 43.3137 78.301L39.9943 73.9827C39.2659 75.1634 38.4496 76.2876 37.5525 77.3459C35.6203 79.7793 38.0824 83.8951 41.1115 81.9545C43.1162 80.6753 45.0889 79.3962 47.1797 78.2622L43.1652 74.251C42.448 75.4492 41.8877 76.6658 41.3157 77.9433C40.2441 80.3125 42.6758 83.8715 45.3302 81.9578C47.4868 80.4087 49.527 78.8292 51.466 77.0101C54.0715 74.5818 50.7775 71.1038 47.9104 72.4015C47.7507 72.577 47.5943 72.7531 47.4413 72.9297L46.39 76.9443C47.5502 76.2111 48.8293 75.6858 50.17 75.3918C53.0505 74.5582 52.8953 70.6398 50.17 69.7336C49.9056 69.6436 49.6423 69.5553 49.3802 69.4687V75.1302C50.6897 74.6358 51.9688 74.3455 53.3425 74.0755L51.0778 68.7076C46.3174 71.06 31.2312 74.8265 36.5687 83.0176C37.4091 81.5377 38.2562 80.0712 39.1033 78.5963C38.5723 78.5446 38.0413 78.4912 37.5103 78.436C34.24 77.7442 32.3972 81.9697 35.2474 83.8057C36.243 84.5212 37.2972 85.1377 38.4098 85.6552L39.8914 80.1809C38.6595 80.2597 37.4293 80.348 36.2008 80.4458C32.4006 80.7344 32.4428 85.9707 36.2008 86.3167C40.0804 86.6693 45.1277 87.724 48.7508 85.7193C49.9033 85.0747 50.5497 84.5077 51.4103 83.5593C52.0161 82.8893 52.654 82.2565 53.302 81.6288C56.245 78.7887 52.5156 82.4624 52.5274 80.213L56.947 77.68L55.624 76.8869C55.1278 78.7094 54.6385 80.5319 54.139 82.3578C55.1436 82.7549 56.1454 83.1481 57.1444 83.5374L58.6294 78.0665C57.0507 77.8831 55.4561 77.8831 53.8774 78.0665C51.6381 78.3179 50.2543 80.3615 51.3411 82.486C53.2699 86.2475 57.6608 87.7038 61.5505 88.5796C65.2377 89.4233 66.7986 83.7618 63.1114 82.9197C60.813 82.3983 57.6085 81.8414 56.4255 79.5278C55.575 80.9943 54.738 82.4675 53.8858 83.9423C55.4648 83.7634 57.0589 83.7634 58.6378 83.9423C61.7243 84.2866 62.3892 79.8991 60.1195 78.4698C58.1485 77.2345 56.4492 76.7435 54.1457 76.487C51.1065 76.1461 50.3404 80.5589 52.6675 81.9528L53.9871 82.7476C55.9159 83.9086 58.3898 82.4152 58.4033 80.2113C58.437 75.7175 55.2156 73.279 51.174 75.8288C49.5 76.8903 48.1112 78.463 46.8017 79.9193C44.7632 82.1789 38.9076 80.6872 36.2093 80.4442V86.315C37.4389 86.2218 38.6691 86.1363 39.8998 86.0585C42.6285 85.8745 44.149 82.0237 41.3848 80.5859C40.2742 80.0706 39.2148 79.4513 38.2208 78.7364C37.4625 80.5263 36.7099 82.3156 35.9629 84.1043C36.9991 84.3273 38.0539 84.4522 39.1135 84.4773C41.2701 84.5245 42.858 81.9123 41.6447 80.0543C40.9073 78.917 52.6455 74.4738 54.0546 73.7819C57.2035 72.2311 54.8848 67.8031 51.7883 68.4157C50.4231 68.684 49.144 68.981 47.8294 69.4703C45.1227 70.4862 44.9623 74.1751 47.8294 75.1319C48.0949 75.2219 48.3593 75.3085 48.6225 75.3918V69.7336C46.719 70.2938 45.0973 70.795 43.4335 71.8733C42.2252 72.6631 41.373 74.5818 42.3822 75.8913C44.8122 79.0553 47.3518 79.079 50.8872 77.4725C49.698 75.9391 48.5117 74.4029 47.3282 72.8639C45.7683 74.3128 44.1156 75.6583 42.3805 76.892L46.3984 80.9099C46.9738 79.6342 47.5257 78.4141 48.2479 77.216C49.8021 74.6257 46.7629 71.8244 44.2266 73.198C42.1358 74.3354 40.1648 75.6179 38.1617 76.892L41.7139 81.5005C42.8918 80.0122 44.0359 78.5322 45.0805 76.9477C46.4203 74.9142 44.1743 71.6742 41.7612 72.6361C38.5077 73.9355 35.428 75.4846 32.3517 77.1485C33.5374 78.6908 34.7248 80.2304 35.914 81.7672C38.9262 79.3338 41.9755 76.9443 44.883 74.3776C47.7265 71.87 43.5567 67.739 40.7284 70.2297"
                          fill="#00A551"
                        />
                        <path
                          d="M48.6377 85.989C50.4298 87.9702 52.6067 88.7144 55.2054 89.1177C55.4642 87.1951 55.7252 85.2724 55.9884 83.3498C55.4319 83.3305 54.8869 83.1864 54.3937 82.9279C54.1288 84.8534 53.874 86.7754 53.6141 88.7025C57.222 88.7042 63.9433 89.1075 65.0672 84.3724C66.4121 78.7109 62.2001 74.0955 57.2979 72.1144L56.5132 77.8806H57.0431C60.5008 77.8806 60.845 73.2045 57.8227 72.1144C56.0694 71.4799 54.387 70.8842 52.7265 70.0371C52.2303 71.8562 51.741 73.6821 51.2415 75.5097C52.8851 75.5941 59.5153 77.2697 58.9685 79.7014C58.653 81.0919 59.193 82.2107 60.3135 83.0207C63.977 85.6482 67.5917 88.6671 72.0973 89.6492C75.4318 90.3782 77.1024 86.1713 74.3602 84.283C73.8227 83.9156 73.2295 83.6369 72.6035 83.4578V89.1177L74.4513 88.5895C78.0812 87.5551 76.532 81.8834 72.887 82.9296C72.2739 83.1119 71.6574 83.2879 71.0375 83.4578C68.1924 84.2729 68.2953 88.2571 71.0375 89.1177C71.1602 89.1964 71.2788 89.2757 71.3936 89.3556C72.1479 87.5618 72.9056 85.7764 73.6582 83.986C69.701 83.1169 66.4965 80.2583 63.2818 77.9515L64.6284 81.2691C66.2687 73.9724 57.2135 69.9544 51.2398 69.6338C48.3592 69.4819 47.1746 73.7918 49.7582 75.108C51.8675 76.1762 54.0478 76.9727 56.2668 77.776C56.5245 75.8534 56.7849 73.9296 57.0482 72.0047H56.5183C52.9796 72.0047 52.8176 76.5981 55.7387 77.776C56.9823 78.2789 61.3665 81.9998 58.523 82.6934C56.9992 83.068 55.1767 82.8368 53.6192 82.8267C50.0568 82.825 49.9455 87.3998 52.8362 88.5895C53.8554 89.0147 54.9033 89.1177 55.9952 89.224C59.2757 89.5531 60.0367 83.9674 56.7748 83.4578C55.2037 83.2114 53.955 83.1203 52.7923 81.8429C50.2475 79.0281 46.1047 83.1912 48.6444 85.989"
                          fill="#00A551"
                        />
                        <path
                          d="M105.554 83.7822C103.033 84.869 100.505 85.922 98.0207 87.0914C95.4084 88.3267 96.642 92.7867 99.5023 92.5657C102.324 92.3412 105.032 91.7286 107.815 91.2477L104.96 86.3489C101.421 89.4691 94.5917 88.7924 90.1721 88.7992C86.922 88.8025 86.0749 93.8954 89.3874 94.567C92.4199 95.1762 95.1401 95.1222 98.1743 94.567C100.974 94.049 101.009 89.3864 98.1743 88.9055C92.5869 87.952 87.111 88.4735 81.4849 88.757C75.4504 89.0708 69.399 88.0178 63.3645 87.8963C59.5221 87.8238 59.6672 93.4161 63.3645 93.7671C66.7142 94.0861 69.8614 94.1755 73.1773 93.6642C75.9836 93.2356 76.0106 88.4009 73.1773 88.0043C66.996 87.1302 57.2963 85.5575 52.2557 90.2622C53.4403 90.107 54.6266 89.9585 55.8163 89.8015C52.9155 88.5713 50.3066 87.1133 47.1054 86.9969C45.0416 86.921 43.2191 89.6176 44.5725 91.4114C45.1716 92.218 45.7774 93.0162 46.3714 93.8195C47.7146 92.483 49.0539 91.1437 50.3893 89.8015C46.0271 87.4323 42.3264 84.7221 37.1678 84.8841C34.3159 84.977 33.0688 88.8801 35.6861 90.355C45.3201 95.7972 56.8187 98.7183 67.8836 98.59C71.6805 98.5428 71.6569 92.8593 67.8836 92.7192C65.8704 92.6365 63.8691 92.4914 61.8542 92.4155C58.5804 92.2872 57.8059 97.5505 61.0779 98.1833C69.9677 99.9046 78.741 99.2026 87.6341 97.8847C90.9838 97.3852 90.0692 92.1134 86.8562 92.1134H84.4414V97.9842C88.1876 97.9741 92.43 98.1125 95.8286 96.241C97.1128 95.5357 104.07 88.5443 104.644 88.8548C106.058 89.6125 107.834 89.216 108.662 87.8002C109.371 86.5868 110.135 85.4326 110.768 84.1805H105.706C106.484 85.0771 107.086 86.0811 107.511 87.1926L112.123 83.6371C110.098 81.1447 107.774 79.8048 104.808 78.6657C103.529 78.1763 102.172 78.9965 101.489 80.014C100.967 80.6553 100.572 81.3539 100.282 82.1251C101.82 81.9271 103.356 81.728 104.891 81.5277C102.785 79.6883 101.269 77.4575 98.8779 75.9505C96.4699 74.4402 93.1303 77.5267 94.86 79.9651C95.4878 80.8527 96.0733 81.58 96.8276 82.3681C97.7771 80.7346 98.7294 79.1 99.6846 77.4642C96.8529 76.8449 94.2829 75.9539 91.3686 75.856C89.5056 75.7868 87.9767 77.7882 88.5369 79.5668C88.8576 80.7008 89.2586 81.8067 89.7401 82.8845L91.7938 79.2665C91.0564 79.5398 90.5113 79.8368 89.9004 80.3245C88.8677 81.1497 88.8542 82.822 89.4381 83.8801C89.9004 84.6552 90.3021 85.4596 90.6429 86.2932C91.7466 84.8521 92.8586 83.416 93.9572 81.9783C90.6176 81.4011 88.2686 77.7933 85.8234 75.6603C83.4458 73.5931 80.8926 72.6295 77.823 72.2347C74.448 71.806 73.9738 77.1132 77.0434 78.0008C81.0782 79.1686 85.0826 79.5567 89.2693 79.6124C93.0999 79.6681 92.9919 74.0251 89.2693 73.7399C83.2888 73.2843 82.0789 76.8314 78.4592 80.6249L83.4694 82.7005C83.2331 80.4528 87.8181 79.172 89.3183 78.6505C93.0426 77.336 96.0581 77.9519 99.5276 79.8149C102.867 81.6037 105.829 76.5344 102.493 74.7355C96.9964 71.7858 92.3743 71.3437 86.5271 73.4075C82.5244 74.8165 77.0704 77.692 77.6003 82.6904C77.8534 85.0748 80.685 86.7826 82.6104 84.7643C84.8008 82.4727 85.5872 79.3188 89.271 79.5989V73.7264C85.6091 73.6792 82.1346 73.3501 78.606 72.3292L77.8247 78.097C83.9031 78.8733 86.2453 86.5683 92.4064 87.628C95.0456 88.0803 96.8327 85.7465 95.7223 83.3097C95.3859 82.4774 94.9835 81.6733 94.5191 80.905C94.3628 82.0863 94.2098 83.2709 94.0601 84.4589C93.8261 84.6108 93.5961 84.7621 93.3699 84.9128C94.7318 84.4167 96.0514 82.8727 95.4169 81.3016C94.9275 80.2304 94.5251 79.1215 94.2137 77.9857C93.267 79.2209 92.3271 80.4646 91.3787 81.7015C93.7176 81.7859 95.8742 82.6111 98.1253 83.1005C100.974 83.7248 103.08 80.3853 100.982 78.1966C100.634 77.7972 100.286 77.3922 99.9411 76.9816C98.5961 78.3215 97.2613 79.6613 95.9198 81.0012C97.8216 82.1909 99.0686 84.1957 100.744 85.6621C102.049 86.7995 104.507 86.894 105.351 85.0681C105.64 84.3008 106.044 83.5977 106.561 82.9587C105.458 83.4143 104.349 83.8582 103.245 84.3138C105.319 85.1052 106.591 86.0738 107.974 87.7681C110.196 90.5069 113.956 87.0256 112.58 84.2108C112.158 83.1103 111.546 82.0921 110.773 81.202C109.573 79.555 106.801 79.0606 105.711 81.202C105.071 82.4525 104.317 83.6101 103.605 84.8234C104.939 84.4673 106.284 84.1214 107.623 83.7687C104.339 82.0019 101.726 82.687 99.1344 85.274C97.3221 87.0712 96.2387 88.9797 94.0854 90.5002C91.3652 92.4121 87.6156 92.0932 84.4633 92.0999C80.6799 92.1067 80.6799 97.9707 84.4633 97.9707H86.8764L86.0951 92.2062C78.2972 93.3605 70.4604 94.0085 62.6625 92.5032L61.8744 98.2677C63.8893 98.3504 65.889 98.4955 67.9039 98.5765V92.7057C57.87 92.8171 47.4092 90.2082 38.6646 85.274C38.1741 87.1021 37.6813 88.9257 37.1863 90.7448C41.1857 90.6217 44.1084 93.0449 47.448 94.864C49.8223 96.1533 53.3424 93.352 51.4626 90.8444C50.8635 90.0378 50.2628 89.2379 49.6569 88.4313L47.124 92.8492C49.2114 92.9251 51.0002 94.0658 52.8683 94.859C54.1373 95.3973 55.359 95.3905 56.4238 94.4017C59.4107 91.6173 67.9562 93.136 71.6451 93.6507V87.9908C68.8809 88.406 66.1556 88.1427 63.3898 87.8828V93.7537C68.8236 93.86 74.2185 94.5569 79.6556 94.6565C85.3509 94.7645 90.9534 93.5815 96.6319 94.5535V88.892C94.7724 89.3583 92.8265 89.3583 90.9669 88.892L90.189 94.6565C96.4699 94.6497 104.129 94.8978 109.126 90.4833C111.551 88.357 108.9 85.1288 106.274 85.5794C104.02 85.9591 101.812 86.4991 99.5243 86.6797C100.015 88.5055 100.513 90.3213 101.008 92.1472C103.487 90.9828 106.018 89.923 108.536 88.8413C112 87.3445 109.003 82.2888 105.572 83.7788"
                          fill="#F6921E"
                        />
                        <path
                          d="M68.4625 99.135C72.166 99.3206 75.869 99.3206 79.5713 99.135C82.7 98.9713 83.7817 93.843 80.3543 93.3654C76.1086 92.7748 71.9185 93.0313 67.6559 93.0549C67.9141 94.982 68.179 96.8973 68.4372 98.8228C71.4933 98.3756 74.3772 97.9959 77.2173 96.71C80.6648 95.144 77.6746 90.0917 74.254 91.6475C71.9759 92.6769 69.3198 92.8119 66.8746 93.1663C63.535 93.659 64.4243 98.9578 67.6542 98.9392C71.3482 98.9072 75.1214 98.5207 78.7968 99.0303L79.573 93.2625C75.8725 93.453 72.1647 93.453 68.4642 93.2625C64.6758 93.0718 64.696 98.9493 68.4642 99.1417M95.9519 82.0558C91.1628 83.4902 86.3753 84.3491 81.3787 84.5752C78.2382 84.717 77.1835 89.8807 80.5973 90.3431C81.5233 90.48 82.4616 90.5151 83.3952 90.4477C86.5103 90.2368 87.6342 85.2367 84.1833 84.6866L83.515 84.5769C84.1968 85.257 84.887 85.9438 85.5653 86.6323C85.4877 87.7038 85.513 87.714 85.6261 86.6627C85.5776 86.2141 85.5112 85.7677 85.427 85.3245C84.7722 81.5968 79.1225 83.1797 79.7654 86.8803C79.5106 85.4173 79.789 87.8878 79.9071 88.1915C80.4235 89.496 81.242 90.1237 82.6207 90.3448C82.8828 88.4222 83.1415 86.4995 83.3969 84.5769C82.984 84.5997 82.5721 84.6363 82.1617 84.6866C81.904 86.6058 81.6436 88.5262 81.3803 90.4477C86.8507 90.2055 92.27 89.2867 97.5145 87.7123C101.133 86.6373 99.5851 80.9673 95.9519 82.0558ZM68.26 72.8792C73.115 72.8657 77.9615 72.7205 82.8063 73.08C82.5464 71.1562 82.2854 69.2342 82.0233 67.3138C80.162 67.761 78.2483 67.6732 76.3398 67.8167C73.1031 68.0546 72.2678 72.6193 75.5635 73.5828C77.2409 74.0773 79.1022 74.219 80.7222 74.9008C80.9534 73.112 81.1795 71.3216 81.4208 69.5362C78.0965 70.7664 74.7501 71.8785 71.3228 72.7678C69.2523 73.3044 68.3798 76.1883 70.0268 77.675C70.7609 78.3382 71.4022 78.993 72.2375 79.5465V74.484C71.8325 74.7506 71.4286 75.02 71.0258 75.2923C69.5611 76.2677 68.9097 78.6065 70.4301 79.9059C71.3009 80.6518 72.0316 81.4145 73.0424 81.9798L73.7444 76.6068C73.0053 76.9241 72.4349 77.2211 71.8426 77.7695C70.5398 78.9643 70.7373 81.6018 72.4349 82.3798C73.0829 82.6734 73.6634 82.9299 74.3553 83.075C78.0475 83.8428 79.6186 78.1863 75.9179 77.4168C75.7435 77.3786 75.572 77.3432 75.4032 77.3105L75.9955 81.9174C75.7683 82.0367 75.5393 82.1548 75.3087 82.2718C77.494 81.3572 78.461 78.2657 76.009 76.9005C75.4488 76.5866 75.0708 76.1613 74.5848 75.7428C74.3823 77.2802 74.195 78.8158 73.9891 80.3497C74.3941 80.0876 74.7985 79.8193 75.2024 79.5448C77.084 78.2927 77.0941 75.726 75.2024 74.4654C74.8728 74.1374 74.5329 73.82 74.1832 73.5137C73.7478 75.1483 73.3141 76.784 72.8821 78.4209C76.3094 77.535 79.6658 76.4162 82.9801 75.1843C85.0439 74.4266 86.2808 70.9183 83.6821 69.8231C81.5407 68.9169 79.3385 68.5592 77.1228 67.9078C76.8646 69.8332 76.598 71.757 76.3381 73.6757C78.7833 73.5002 81.1896 73.544 83.5876 72.9652C86.9626 72.1552 85.972 67.4319 82.8046 67.199C77.9598 66.8396 73.1133 66.9813 68.2583 66.9948C64.475 67.0185 64.4766 72.8859 68.26 72.8792ZM89.4955 73.5795C94.1345 75.0493 98.4967 77.1553 102.731 79.5482C103.482 77.7594 104.235 75.9707 104.99 74.1819C103.794 73.8528 102.618 73.7955 101.384 73.6706C100.073 73.5322 98.9135 74.6747 98.5506 75.8222C99.0856 74.0992 101.1 74.1701 99.7015 74.2106C98.9523 74.2123 98.1963 74.1347 97.4588 74.0688C96.1409 73.944 94.8297 73.7162 93.5067 73.6706C90.9029 73.5778 89.6761 76.9173 91.4311 78.6825C92.7912 80.0544 94.2425 80.4577 96.1291 80.5488C99.9209 80.7497 99.899 74.8788 96.1291 74.678C95.9536 74.6257 95.7663 74.5785 95.5874 74.5278C94.8921 76.1968 94.2053 77.8674 93.5101 79.5431C96.7281 79.6494 102.866 81.7183 104.216 77.3848C103.274 78.1059 102.331 78.8253 101.387 79.5431C102.076 79.5836 102.759 79.6826 103.436 79.8401C106.641 80.7227 108.617 76.1259 105.694 74.4722C101.033 71.8363 96.1713 69.5312 91.0598 67.9145C87.4283 66.7738 85.8927 72.4488 89.4955 73.5795ZM105.976 84.42C105.336 85.1439 104.668 85.8206 103.929 86.4399C104.109 86.3139 104.054 86.3555 103.765 86.5648C103.591 86.6863 103.415 86.805 103.239 86.9208C103.057 87.0326 102.872 87.1401 102.685 87.2432C102.734 87.2094 101.806 87.6768 102.224 87.4997C100.749 88.1156 99.7117 89.4183 100.171 91.1126C100.555 92.5031 102.305 93.7839 103.784 93.1629C106.279 92.1183 108.333 90.5962 110.135 88.5712C111.197 87.3748 111.31 85.5978 110.135 84.4183C109.047 83.3433 107.037 83.2252 105.976 84.42ZM44.4308 91.4552C45.985 91.4568 47.5257 91.6661 49.0715 91.8635C50.6645 92.061 52.0043 90.3735 52.0043 88.9273C52.0043 87.1706 50.6577 86.1902 49.0715 85.9877C47.5257 85.797 45.985 85.5995 44.4308 85.5843C42.8226 85.5708 41.4912 86.9343 41.4912 88.5257C41.4912 90.1355 42.8226 91.4417 44.4308 91.4552Z"
                          fill="#A87C4F"
                        />
                        <path
                          d="M56.8981 26.9153C47.9696 31.0429 44.2419 38.5708 48.4269 46.951C50.9244 51.951 54.8951 56.2575 58.1249 60.888C62.2458 66.8078 62.1665 72.223 58.8927 78.4768C57.617 80.9052 61.6906 83.0331 62.9731 80.5896C67.6003 71.769 66.6215 64.8216 60.7844 56.7621C54.5137 48.1001 44.7566 37.2428 59.2859 30.5299C61.9944 29.2778 59.5998 25.6631 56.8998 26.9102"
                          fill="#E6E7E8"
                        />
                        <path
                          d="M72.386 85.473C76.5878 80.7767 77.5497 76.0264 75.4049 70.326C73.0559 64.089 68.4187 59.018 68.3427 52.1803C68.2769 46.5187 71.4443 41.0023 73.6482 35.8166C75.9095 30.4892 77.0401 25.1584 75.8268 19.512C75.2632 16.8643 70.7137 17.9848 71.2655 20.624C73.4339 30.7997 65.4082 39.6405 63.8607 49.4128C63.1435 53.964 64.1223 58.4156 66.2283 62.582C69.5392 69.1245 75.0455 75.7985 69.038 82.5131C67.1682 84.6073 70.4909 87.5756 72.386 85.4696"
                          fill="#E6E7E8"
                        />
                        <path
                          d="M86.9576 78.9694C86.9019 74.371 86.2185 70.1691 84.531 65.817C83.7379 63.7853 82.3862 62.0033 81.6504 59.9428C80.9113 57.879 82.3811 55.4355 83.4459 53.716C87.0217 47.9548 90.7899 43.4374 86.9475 36.8815C85.5351 34.4818 81.4581 36.5996 82.8519 38.9891C86.6049 45.3831 78.7192 50.5603 77.0841 56.5408C76.2369 59.6222 77.4604 62.3796 78.9724 65.1116C81.4159 69.5498 82.1601 74.0723 82.2157 78.9694C82.2596 81.6677 86.9914 81.6677 86.9576 78.9694Z"
                          fill="#E6E7E8"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_1385_7520">
                          <rect
                            width="108"
                            height="108"
                            fill="white"
                            transform="translate(17.5 18)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  {/* Title */}
                  <div className="flex flex-col items-center">
                    <h3 className="text-xl font-semibold text-gray-700 mb-3">
                      You have no food
                    </h3>
                    {/* Description */}
                    <p className="text-gray-500 mb-6 text-center max-w-md">
                      Click below button to add food
                    </p>
                  </div>
                  {/* Add Food Button */}
                  <button
                    onClick={handleAddFoodClick}
                    disabled={isAddFoodDisabled()}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors font-semibold ${
                      !isAddFoodDisabled()
                        ? "bg-[#429818] text-white hover:bg-[#3E7B27] cursor-pointer"
                        : "bg-[#A3CFA0] text-white cursor-not-allowed"
                    }`}
                  >
                    <PlusIcon className="h-5 w-5" strokeWidth={2} />
                    Add food
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-6 min-h-[400px] relative border-2 border-dashed border-gray-300">
                {allSelectedDishes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <PiBowlFood className="w-16 h-16 text-gray-300 mb-4" />
                    <p className="text-gray-500">No foods selected yet</p>
                  </div>
                ) : (
                  <div className="pb-16">
                    {" "}
                    {/* Add bottom padding to prevent overlap with add button */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {allSelectedDishes.map((dish) => (
                        <div
                          key={dish.id}
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow mr-2"
                        >
                          {/* Dish Image */}
                          <div className="w-16 h-16 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                            {dish.imageURL ? (
                              <img
                                src={dish.imageURL}
                                alt={dish.name || dish.name_kh || "Dish"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <PiBowlFood className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </div>

                          {/* Dish Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-800 mb-1 text-sm truncate">
                              {dish.name || dish.name_kh || "Unnamed Dish"}
                            </h4>
                            {dish.description && (
                              <p className="text-xs text-gray-500 line-clamp-2">
                                {dish.description}
                              </p>
                            )}
                            {dish.price && (
                              <p className="text-sm font-bold text-[#429818] mt-1">
                                ${dish.price}
                              </p>
                            )}
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => {
                              if (!isEditMode) return; // Only allow removal in edit mode
                              setAllSelectedDishes((prev) =>
                                prev.filter((d) => d.id !== dish.id)
                              );
                              // Check if this was the last dish from this category
                              if (dish.categoryId) {
                                const remainingDishesFromCategory =
                                  allSelectedDishes.filter(
                                    (d) =>
                                      d.categoryId?.toString() ===
                                      dish.categoryId?.toString()
                                  );
                                if (remainingDishesFromCategory.length === 1) {
                                  setCategoriesWithSelections((prev) => {
                                    const newSet = new Set(prev);
                                    newSet.delete(dish.categoryId!);
                                    return newSet;
                                  });
                                }
                              }
                              // Mark as having unsaved changes
                              setHasUnsavedChanges(true);
                            }}
                            disabled={!isEditMode}
                            className={`p-2 rounded-full transition-colors flex-shrink-0 ${
                              isEditMode 
                                ? "hover:bg-red-100 cursor-pointer" 
                                : "cursor-not-allowed opacity-50"
                            }`}
                            title={isEditMode ? "Remove dish" : "Enter edit mode to remove dishes"}
                          >
                            <XMarkIcon className={`h-5 w-5 ${isEditMode ? "text-red-500" : "text-gray-400"}`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Circular Add More Button - positioned at bottom right edge */}
                {hasFood && (
                  <button
                    onClick={handleAddFoodClick}
                    disabled={isAddFoodDisabled()}
                    className={`absolute bottom-6 right-6 w-14 h-14 rounded-full shadow-xl transition-all duration-200 flex items-center justify-center z-10 ${
                      !isAddFoodDisabled()
                        ? "bg-[#429818] text-white hover:bg-[#3E7B27] hover:scale-105 cursor-pointer"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    title="Add more dishes"
                  >
                    <PlusIcon className="h-7 w-7" strokeWidth={2} />
                  </button>
                )}
              </div>
            )}
          </div>
        </PageTransition>
      </main>

      {/* Category/Dish Selection Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl mx-4 h-[80vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                {modalStep === "dishes" && (
                  <button
                    onClick={handleBackToCategories}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
                  </button>
                )}
                <h2 className="text-2xl font-semibold text-[#3A4038]">
                  {modalStep === "category"
                    ? "Select Category"
                    : `Select Dishes - ${selectedCategory?.name}`}
                </h2>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XMarkIcon className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {modalStep === "category" ? (
                // Category Selection Step
                <div className="p-6 flex-1 overflow-y-auto">
                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <Loading className="m-10" />
                    </div>
                  ) : categories.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <PiBowlFood className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p>No categories available</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {categories.map((category) => {
                        const hasSelections = categoriesWithSelections.has(
                          category.id
                        );
                        return (
                          <button
                            key={category.id}
                            onClick={() => handleCategorySelect(category)}
                            className={`p-4 border-2 rounded-lg hover:border-[#429818] hover:bg-green-50 transition-all duration-200 text-left group ${
                              hasSelections
                                ? "border-[#429818] bg-green-50"
                                : "border-gray-200"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold text-gray-800 group-hover:text-[#3E7B27] transition-colors">
                                  {category.name}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                  {hasSelections
                                    ? "Some foods selected - click to add more"
                                    : "Click to select this category"}
                                </p>
                              </div>
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                  hasSelections
                                    ? "bg-[#429818]"
                                    : "bg-gray-100 group-hover:bg-[#429818]"
                                }`}
                              >
                                {hasSelections ? (
                                  <CheckIcon className="h-4 w-4 text-white" />
                                ) : (
                                  <PlusIcon className="h-4 w-4 text-gray-500 group-hover:text-white transition-colors" />
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                // Dish Selection Step
                <div className="p-6 flex-1 overflow-y-auto">
                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <Loading className="m-10" />
                    </div>
                  ) : dishes.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <PiBowlFood className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p>No dishes available in this category</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {dishes.map((dish) => {
                        const isSelected = selectedDishes.has(dish.id);
                        const isAlreadySelected = allSelectedDishes.some(
                          (d) => d.id === dish.id
                        );
                        return (
                          <div
                            key={dish.id}
                            onClick={() =>
                              !isAlreadySelected && handleDishSelect(dish.id)
                            }
                            className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                              isAlreadySelected
                                ? "bg-gray-100 border-gray-300 cursor-not-allowed opacity-60"
                                : isSelected
                                ? "bg-white border-[#429818] cursor-pointer"
                                : "bg-white border-gray-200 hover:border-[#429818] hover:shadow-md cursor-pointer group"
                            }`}
                          >
                            {/* Rounded Dish Image */}
                            <div className="w-16 h-16 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                              {dish.imageURL ? (
                                <img
                                  src={dish.imageURL}
                                  alt={dish.name || dish.name_kh || "Dish"}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <PiBowlFood className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                            </div>

                            {/* Dish Info */}
                            <div className="flex-1 min-w-0">
                              <h3
                                className={`font-semibold mb-1 text-base truncate transition-colors ${
                                  isAlreadySelected
                                    ? "text-gray-500"
                                    : "text-gray-800 group-hover:text-[#3E7B27]"
                                }`}
                              >
                                {dish.name || dish.name_kh || "Unnamed Dish"}
                                {isAlreadySelected && (
                                  <span className="ml-2 text-xs text-gray-500 font-normal">
                                    (Already selected)
                                  </span>
                                )}
                              </h3>
                              {dish.description && (
                                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                                  {dish.description}
                                </p>
                              )}
                              {dish.price && (
                                <div className="flex items-center gap-2 mt-2">
                                  <p className="text-base font-bold text-[#429818]">
                                    ${dish.price}
                                  </p>
                                  {dish.rating && (
                                    <div className="flex items-center gap-1">
                                      <span className="text-yellow-500 text-sm">
                                        ★
                                      </span>
                                      <span className="text-sm text-gray-600">
                                        {dish.rating.toFixed(1)}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Selection Circle - At the end */}
                            <div
                              className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                                isAlreadySelected
                                  ? "bg-gray-400 border-gray-400"
                                  : isSelected
                                  ? "bg-[#429818] border-[#429818]"
                                  : "bg-white border-gray-300 group-hover:border-[#429818]"
                              }`}
                            >
                              {(isSelected || isAlreadySelected) && (
                                <CheckIcon className="h-4 w-4 text-white" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end items-center p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-3">
                {modalStep === "dishes" && selectedDishes.size > 0 && (
                  <>
                    <button
                      onClick={handleCloseModal}
                      className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitSelection}
                      className="px-6 py-2 bg-[#429818] text-white rounded-lg hover:bg-[#3E7B27] transition-colors font-medium"
                    >
                      Add Selected ({selectedDishes.size})
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Alert */}
      <CustomAlert
        isOpen={alert.isOpen}
        onClose={closeAlert}
        title={alert.title}
        message={alert.message}
        type={alert.type}
      />

      {/* Cancel Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showCancelConfirmation}
        onClose={handleCancelConfirmation}
        onConfirm={handleConfirmCancel}
        title="Discard Changes?"
        message="You have made changes to the food selection. Are you sure you want to cancel and discard all changes?"
        confirmText="Yes, Discard"
        cancelText="No, Keep Editing"
        type="warning"
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteConfirmation}
        onClose={isDeleting ? () => { /* No-op during deletion */ } : handleDeleteConfirmation}
        onConfirm={handleConfirmDelete}
        title="Delete Vote Poll?"
        message={`Are you sure you want to delete the vote poll for ${new Date(selectedDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}? This action cannot be undone.`}
        confirmText={isDeleting ? "Deleting..." : "Yes, Delete"}
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default FoodForVoter;
