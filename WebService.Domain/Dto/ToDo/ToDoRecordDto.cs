using System;

namespace WebService.Domain.Dto.ToDo
{
    public class ToDoRecordDto
    {
        public int Id { get; set; }

        public string Text { get; set; }

        public DateTime DateCreate { get; set; }
    }
}
