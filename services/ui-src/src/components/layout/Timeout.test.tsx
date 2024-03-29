import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { axe } from "jest-axe";
// utils
import { mockStateUser, RouterWrappedComponent } from "utils/testing/setupJest";
import { initAuthManager, useUser } from "utils";
//components
import { Timeout } from "components";
import { IDLE_WINDOW, PROMPT_AT } from "../../constants";

const timeoutComponent = (
  <RouterWrappedComponent>
    <Timeout />
  </RouterWrappedComponent>
);

const mockLogout = jest.fn();

const mockUser = {
  ...mockStateUser,
  logout: mockLogout,
};

jest.mock("utils/auth/useUser");
const mockedUseUser = useUser as jest.MockedFunction<typeof useUser>;

const spy = jest.spyOn(global, "setTimeout");

describe("Test Timeout Modal", () => {
  beforeEach(async () => {
    jest.useFakeTimers();
    mockedUseUser.mockReturnValue(mockUser);
    initAuthManager();
    await render(timeoutComponent);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    spy.mockClear();
  });

  test("Timeout modal is visible", async () => {
    await act(async () => {
      jest.advanceTimersByTime(PROMPT_AT + 5000);
    });
    await waitFor(() => {
      expect(screen.getByText("Stay logged in")).toBeVisible();
      expect(screen.getByText("Log out")).toBeVisible();
    });
  });

  test("Timeout modal refresh button is clickable and closes modal", async () => {
    await act(async () => {
      jest.advanceTimersByTime(PROMPT_AT + 5000);
    });
    const refreshButton = screen.getByText("Stay logged in");
    await act(async () => {
      await fireEvent.click(refreshButton);
    });
    await waitFor(() => {
      expect(screen.getByText("Stay logged in")).not.toBeVisible();
      expect(screen.getByText("Log out")).not.toBeVisible();
    });
  });

  test("Timeout modal logout button is clickable and triggers logout", async () => {
    await act(async () => {
      jest.advanceTimersByTime(PROMPT_AT + 5000);
    });
    const logoutButton = screen.getByText("Log out");
    mockLogout.mockReset();
    await act(async () => {
      await fireEvent.click(logoutButton);
    });
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
  test("Timeout modal executes logout on timeout", async () => {
    mockLogout.mockReset();

    await act(async () => {
      jest.advanceTimersByTime(10 * IDLE_WINDOW);
    });
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});

describe("Test Timeout Modal accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    initAuthManager();
    mockedUseUser.mockReturnValue(mockUser);
    const { container } = render(timeoutComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
