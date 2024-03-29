import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { SpreadsheetWidget } from "components";

const SpreadsheetWidgetComponent = (
  <SpreadsheetWidget description="mock-description" />
);

describe("Test SpreadsheetWidget with all props", () => {
  beforeEach(() => {
    render(SpreadsheetWidgetComponent);
  });

  test("Component is visible", () => {
    expect(screen.getByText("mock-description")).toBeVisible();
  });
});

describe("Test SpreadsheetWidget accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(SpreadsheetWidgetComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
