import { BillsService } from "../../bills";
import { EventsService } from "..";
import { resetEvents, testEvents } from "@test";

describe(`EventsService methods`, () => {
  afterEach(async () => {
    await resetEvents();
  });

  describe(`Create Event`, () => {
    it(`Creates a new event in the DB`, async () => {
      const testEventInput = testEvents[1];
      const testEventResult = await new EventsService().createEvent(
        testEventInput,
      );

      // Test event minus the fields id and created_at (which will differ between creations)
      const testEvent = {
        bill_code: "C-829",
        title: "Bill was Defeated",
        publication_date: new Date("2020-08-28T07:00:00.000Z"),
      };

      delete testEventResult.id;
      delete testEventResult.created_at;
      expect(testEventResult).toEqual(testEvent);
    });

    it(`Should fail if bill doesn't exist in the DB`, async () => {
      const testInvalidBillEvent = {
        bill_code: "C-NOT-A-BILL",
        title: "Bill was Defeated",
        publication_date: "December 21, 2012",
      };

      try {
        await new EventsService().createEvent(testInvalidBillEvent);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe(`Create Events`, () => {
    it(`Creates many events in the DB`, async () => {
      const testEventsInput = testEvents;
      const testEventsResult = await new EventsService().createManyEvents(
        testEventsInput,
      );

      expect(Array.isArray(testEventsResult)).toBeTruthy();
      expect(testEventsResult).toHaveLength(testEventsInput.length);
    });

    it(`Should fail if bill in the array doesn't exist in the DB`, async () => {
      const testInvalidBillEvent = {
        bill_code: "C-NOT-A-BILL",
        title: "Bill was Defeated",
        publication_date: "December 21, 2012",
      };
      const testInvalidBillEventsArray = {
        ...testEvents,
        testInvalidBillEvent,
      };

      try {
        await new EventsService().createManyEvents(testInvalidBillEventsArray);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe(`Update Bills Passed`, () => {
    it(`Updates a bill's passed status if the event indicates it has passed`, async () => {
      const testEventsInput = [testEvents[0]];

      const billUpdated = await new EventsService().updateBillsPassedStatus(
        testEventsInput,
      );

      const updatedBill = await new BillsService().findBill("C-420");

      expect(billUpdated).toBeTruthy;
      expect(updatedBill.passed).toBeTruthy();

      // Reset bill after test passes
      await new BillsService().updateOne({
        table: "bills",
        data: { code: "C-420", passed: undefined },
      });
    });

    it(`Updates a bill's passed status if the event indicates it has failed`, async () => {
      const testEventsInput = [testEvents[1]];

      const billUpdated = await new EventsService().updateBillsPassedStatus(
        testEventsInput,
      );

      const updatedBill = await new BillsService().findBill("C-420");

      expect(billUpdated).toBeTruthy;
      expect(updatedBill.passed).toBeFalsy();

      // Reset bill after test passes
      await new BillsService().updateOne({
        table: "bills",
        data: { code: "C-829", passed: undefined },
      });
    });

    it(`Should not update any bills if none have passed or failed`, async () => {
      const testEventsInput = [testEvents[2]];

      const billUpdated = await new EventsService().updateBillsPassedStatus(
        testEventsInput,
      );

      expect(billUpdated).toBeFalsy;
    });
  });

  describe(`Delete Event`, () => {
    it(`Deletes a event in the DB by its bill_code`, async () => {
      const testEventInput = testEvents[2];

      // Create event to test deletion method
      await new EventsService().createEvent(testEventInput);

      const deleteBillResult = await new EventsService().deleteEvent(
        testEventInput.bill_code,
      );

      expect(deleteBillResult).toEqual(true);
    });
  });
});
