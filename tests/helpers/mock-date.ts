/**
 * Mock Date whenever the class Date is called
 * (global as any).Date = MockDate; // before all calls
 * (global as any).Date = RealDate; // after all calls, to calls run normally
 */
export const RealDate = Date;
export class MockDate extends RealDate {
  constructor() {
    super('2030-11-31T00:00:00Z');
  }
}