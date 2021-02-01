export const logs = {
  started: () =>
    console.log(
      `[UPDATE DB SCRIPT] Beginning new fetch of Bills from LEGISinfo website ...`,
    ),
  fetchedBills: (billsLength: number, eventsLength: number) =>
    console.log(
      `[UPDATE DB SCRIPT] Succesfully fetched ${billsLength} bills and ${eventsLength} events ...`,
    ),
  adding: () =>
    console.log(
      `[UPDATE DB SCRIPT] Adding bills and events to database [${process.env
        .POSTGRES_DB!}] ...`,
    ),
  addedBills: (createdLength: number) =>
    console.log(
      `[UPDATE DB SCRIPT] Succesfully added ${createdLength} bills to the database! ...`,
    ),
  addedEvents: (createdLength: number) =>
    console.log(
      `[UPDATE DB SCRIPT] Succesfully added ${createdLength} events to the database! ...`,
    ),
  summaryUpdate: () =>
    console.log(`[UPDATE DB SCRIPT] Beginning update of bill summary URLs ...`),
  success: (
    billsLength: number,
    eventsLength: number,
    billsUpdatedWithSummaries: number,
  ) =>
    console.log(
      `[UPDATE DB SUCCESS] The database ${
        process.env.POSTGRES_DB
      } has been updated with ${billsLength} bills and ${eventsLength} events. ${
        billsUpdatedWithSummaries
          ? `${billsUpdatedWithSummaries} bills updated with new Bill summaries.`
          : ``
      }`,
    ),
};
