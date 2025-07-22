import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Mock, vi } from "vitest";
import { useGetCountries } from "../../hooks/useGetCountries";
import { useGetCurrencies } from "../../hooks/useGetCurrencies";
import { useHotToast } from "../../hooks/useHotToast";
import { AuthProvider } from "../../app/AuthProvider";
import CreateTripPopup from "./CreateTripPopup";

vi.mock("../../hooks/useGetCountries");
vi.mock("../../hooks/useGetCurrencies");
vi.mock("../../hooks/useHotToast");

const mockNotify = vi.fn();
const mockOnSubmit = vi.fn();
const mockOnClose = vi.fn();

(useGetCountries as Mock).mockReturnValue({
  countries: [
    { id: "JP", name: "Japan" },
    { id: "NZ", name: "New Zealand" },
  ],
  error: null,
});

(useGetCurrencies as Mock).mockReturnValue({
  currencies: [
    { currencyCode: "USD", symbol: "$" },
    { currencyCode: "NZD", symbol: "NZ$" },
  ],
  error: null,
});

(useHotToast as Mock).mockReturnValue({
  notify: mockNotify,
});

const renderComponent = (isOpen = true) => {
  render(
    <AuthProvider>
      <CreateTripPopup
        isOpen={isOpen}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    </AuthProvider>
  );
};

const user = userEvent.setup();

const inputTripName = async (tripName?: string) => {
  const tripNameInput = screen.getByLabelText("trip name");
  await user.clear(tripNameInput);
  await user.type(tripNameInput, tripName ?? "Test Trip");
};

const inputStartAndEndDate = async (startDate?: string, endDate?: string) => {
  const startDateInput = screen.getByLabelText("start date");
  const endDateInput = screen.getByLabelText("end date");
  await user.clear(startDateInput);
  await user.clear(endDateInput);
  await user.type(startDateInput, startDate ?? "2100-10-10");
  await user.type(endDateInput, endDate ?? "2100-10-20");
};

const inputLocation = async () => {
  const locationSelect = screen.getByLabelText("multi-select");
  await user.click(locationSelect);
  const locationOption = await screen.findByText("Japan");
  await user.click(locationOption);
};

const inputNumberOfPeople = async (numberOfPeople?: string) => {
  const peopleInput = screen.getByLabelText("numberOfPeople");
  await user.type(peopleInput, numberOfPeople ?? "2");
};

const inputCurrency = async () => {
  const currencySelect = screen.getByLabelText("single-select");
  await user.click(currencySelect);
  const currencyOption = await screen.findByText("NZD");
  await user.click(currencyOption);
};

const inputBudget = async (budget?: string) => {
  const budgetInput = screen.getByLabelText("budget");
  await user.type(budgetInput, budget ?? "100");
};

const submitForm = async () => {
  const saveButton = screen.getByRole("button", { name: "Save" });
  await user.click(saveButton);
};

describe("CreateTripPopup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits the form when all fields are filled in", async () => {
    renderComponent();
    await inputTripName();
    await inputStartAndEndDate();
    await inputLocation();
    await inputNumberOfPeople();
    await inputCurrency();
    await inputBudget();
    await submitForm();
    expect(mockOnSubmit).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
    expect(mockNotify).not.toHaveBeenCalled();
  });

  it("calls onClose when the cancel button is clicked", async () => {
    renderComponent();
    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    await userEvent.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("shows an error when trip name is empty", async () => {
    renderComponent();
    await inputTripName("  ");
    await inputStartAndEndDate();
    await inputLocation();
    await inputNumberOfPeople();
    await inputCurrency();
    await inputBudget();
    await submitForm();
    expect(mockNotify).toHaveBeenCalledWith(
      "Please fill in all the fields.",
      "error"
    );
  });

  it("shows an error when start date is empty", async () => {
    renderComponent();
    await inputTripName();
    await inputStartAndEndDate(" ");
    await inputLocation();
    await inputNumberOfPeople();
    await inputCurrency();
    await inputBudget();
    await submitForm();
    expect(mockNotify).toHaveBeenCalledWith(
      "Please fill in all the fields.",
      "error"
    );
  });

  it("shows an error when end date is empty", async () => {
    renderComponent();
    await inputTripName();
    await inputStartAndEndDate(undefined, " ");
    await inputLocation();
    await inputNumberOfPeople();
    await inputCurrency();
    await inputBudget();
    await submitForm();
    expect(mockNotify).toHaveBeenCalledWith(
      "Please fill in all the fields.",
      "error"
    );
  });

  it("shows an error when location isn't selected", async () => {
    renderComponent();
    await inputTripName();
    await inputStartAndEndDate();
    await inputNumberOfPeople();
    await inputCurrency();
    await inputBudget();
    await submitForm();
    expect(mockNotify).toHaveBeenCalledWith(
      "Please fill in all the fields.",
      "error"
    );
  });

  it("shows an error when number of people is 0", async () => {
    renderComponent();
    await inputTripName();
    await inputStartAndEndDate();
    await inputNumberOfPeople("0");
    await inputCurrency();
    await inputBudget();
    await submitForm();
    expect(mockNotify).toHaveBeenCalledWith(
      "Please fill in all the fields.",
      "error"
    );
  });

  it("shows an error when currency isn't selected", async () => {
    renderComponent();
    await inputTripName();
    await inputStartAndEndDate();
    await inputNumberOfPeople();
    await inputBudget();
    await submitForm();
    expect(mockNotify).toHaveBeenCalledWith(
      "Please fill in all the fields.",
      "error"
    );
  });

  it("shows an error when budget is invalid", async () => {
    renderComponent();
    await inputTripName();
    await inputStartAndEndDate();
    await inputNumberOfPeople();
    await inputCurrency();
    await inputBudget("-100");
    await submitForm();
    expect(mockNotify).toHaveBeenCalledWith(
      "Please fill in all the fields.",
      "error"
    );
  });

  it("shows an error notification if end date is before start date", async () => {
    renderComponent();
    await inputTripName();
    await inputStartAndEndDate("2100-10-20", "2100-10-10");
    await inputLocation();
    await inputNumberOfPeople();
    await inputCurrency();
    await inputBudget();
    await submitForm();

    expect(mockNotify).toHaveBeenCalledWith(
      "End date must be after start date.",
      "error"
    );
  });

  it("shows an error notification if the start date is in the past", async () => {
    renderComponent();
    await inputTripName();
    await inputStartAndEndDate("2000-10-10", "2000-10-11");
    await inputLocation();
    await inputNumberOfPeople();
    await inputCurrency();
    await inputBudget();
    await submitForm();

    expect(mockNotify).toHaveBeenCalledWith(
      "Start date must be in the future.",
      "error"
    );
  });

  it("shows an error notification if country API error occurs", async () => {
    (useGetCountries as Mock).mockReturnValueOnce({
      countries: [],
      error: "Error fetching countries",
    });

    renderComponent();
    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith(
        "Something went wrong. Please try again.",
        "error"
      );
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("shows an error notification if currency API error occurs", async () => {
    (useGetCurrencies as Mock).mockReturnValueOnce({
      countries: [],
      error: "Error fetching currencies",
    });

    renderComponent();
    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith(
        "Something went wrong. Please try again.",
        "error"
      );
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
