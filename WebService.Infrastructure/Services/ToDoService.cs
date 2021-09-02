using ClosedXML.Excel;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebService.Domain.Dto.ToDo;
using WebService.Domain.Model;
using WebService.Domain.Query.ToDo;
using WebService.Domain.ServicesContract;
using WebService.Infrastructure.Context;
using WebService.Infrastructure.Entity;

namespace WebService.Infrastructure.Services
{
    public class ToDoService : IToDoService
    {
        private ApplicationContext _context { get; set; }

        public ToDoService(ApplicationContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ToDoRecordDto>> GetToDoRecordsAsync
            (GetToDoQuery query, CancellationToken ct)
        {
            try
            {
                DateTime start = default;
                DateTime end = default;

                switch (query.TypeView)
                {
                    case TypeViewPeriodRecord.Today:
                        {
                            start = DateTime.Today;
                            end = DateTime.Today.AddHours(23).AddMinutes(59);
                            break;
                        }
                    case TypeViewPeriodRecord.Yeasterday:
                        {
                            start = DateTime.Today.AddDays(-1);
                            end = DateTime.Today.AddDays(-1).AddHours(23).AddMinutes(59);
                            break;
                        }
                    case TypeViewPeriodRecord.Week:
                        {
                            int g = (int)DateTime.Now.DayOfWeek;
                            if (g == 0)
                                g = 7;
                            start = DateTime.Today.AddDays(-(g - 1));
                            end = DateTime.Today.AddHours(23).AddMinutes(59);
                            break;
                        }
                    case TypeViewPeriodRecord.Calendare:
                        {
                            start = (DateTime)query.DateFilter.Start;
                            end = (DateTime)query.DateFilter.End;
                            break;
                        }
                }

                var user = await _context.User
                    .Where(x => x.Id == query.UserId)
                    .Include(records => records.TodoRecords
                        .Where(record =>
                            record.DateCreate >= start &&
                            record.DateCreate <= end
                            ))
                    .FirstOrDefaultAsync(ct);

                if (user != null)
                {

                    var records = user.TodoRecords
                        .Select(x => new ToDoRecordDto()
                        {
                            DateCreate = x.DateCreate,
                            Text = x.Text,
                            Id = x.Id
                        })
                        .OrderByDescending(x => x.DateCreate)
                        .ToList();
                    return records;
                }
                throw new KeyNotFoundException();
            }
            catch (Exception e)
            {
                throw;
            }
        }

        public async Task<bool> RemoveTodoRecordAsync(int IdRecord, int IdUser, CancellationToken ct)
        {
            try
            {
                var record = await _context.TodoRecord
                    .Where(x => x.Id == IdRecord && x.IdUser == IdUser)
                    .FirstOrDefaultAsync(ct);

                if (record != null)
                {
                    _context.TodoRecord.Remove(record);
                    await _context.SaveChangesAsync(ct);
                    return true;
                }
                return false;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> UpdateTodoRecordAsync(ToDoRecordDto upRecord, int IdUser, CancellationToken ct)
        {
            try
            {
                var record = await _context.TodoRecord
                   .Where(x => x.Id == upRecord.Id && x.IdUser == IdUser)
                   .FirstOrDefaultAsync(ct);

                if (record != null)
                {
                    record.Text = upRecord.Text;
                    _context.TodoRecord.Update(record);
                    await _context.SaveChangesAsync(ct);
                    return true;
                }
                return false;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> AddTodoRecordAsync(ToDoRecordDto Record, int IdUser, CancellationToken ct)
        {
            try
            {
                var newRecord = new TodoRecord();
                newRecord.DateCreate = DateTime.Now;
                newRecord.IdUser = IdUser;
                newRecord.Text = Record.Text;
                await _context.TodoRecord.AddAsync(newRecord, ct);
                await _context.SaveChangesAsync(ct);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<int> GetCountRecordAsync(int IdUser, CancellationToken ct)
        {
            try
            {
                var user = await _context.User
                    .Where(x => x.Id == IdUser)
                    .Include(y => y.TodoRecords)
                    .FirstOrDefaultAsync(ct);

                if (user != null)
                    return user.TodoRecords.Count();

                throw new KeyNotFoundException();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<byte[]> GetExportFileAsync(GetToDoQuery query, CancellationToken ct)
        {
            try
            {
                var result = new byte[0];
                var records = await GetToDoRecordsAsync(query, ct);

                using var workbook = new XLWorkbook();
                var worksheet = workbook.Worksheets.Add("records");

                var currentRow = 1;
                worksheet.Cell(currentRow, 1).Value = "text";
                worksheet.Cell(currentRow, 2).Value = "date";
                currentRow++;

                foreach (var record in records)
                {
                    worksheet.Cell(currentRow, 1).Value = record.Text;
                    worksheet.Cell(currentRow, 2).Value = record.DateCreate;
                    currentRow++;
                }

                worksheet.Columns().AdjustToContents();

                using MemoryStream stream = new MemoryStream();
                workbook.SaveAs(stream);
                return stream.ToArray();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<bool> ImportFIleAsync(Stream stream, int IdUser, CancellationToken ct)
        {
            try
            {
                using var workbook = new XLWorkbook(stream);

                var worksheet = workbook.Worksheet(1);
                var rows = worksheet.RangeUsed().RowsUsed(); // Skip header row

                var listRecords = new List<TodoRecord>();
                foreach (var row in rows)
                {
                    listRecords.Add(new TodoRecord()
                    {
                        IdUser = IdUser,
                        Text = (string)row.Cell(1).Value,
                        DateCreate = (DateTime)row.Cell(2).Value
                    });
                }

                await _context.TodoRecord.AddRangeAsync(listRecords, ct);
                await _context.SaveChangesAsync(ct);

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
