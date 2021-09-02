using System;
using WebService.Domain.Model;

namespace WebService.Domain.Query.ToDo
{
    public class GetToDoQuery
    {
        public TypeViewPeriodRecord TypeView { get; set; }

        public int UserId { get; set; }

        public DateFIlterDto DateFilter { get; set; }
    }

    public class DateFIlterDto
    {
        public DateTime? Start { get; set; }
        public DateTime? End { get; set; }
    }
}
