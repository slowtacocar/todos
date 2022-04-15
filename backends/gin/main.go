package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"todos-database"
)

func main() {
	r := gin.Default()

	r.Use(cors.Default())

	database := todos_database.NewTodosDatabase()

	r.GET("/todos", func(c *gin.Context) {
		todos := database.GetTodos()
		c.JSON(200, todos)
	})

	r.POST("/todos", func(c *gin.Context) {
		var input todos_database.TodoInput
		c.BindJSON(&input)
		todo := database.AddTodo(input)
		c.JSON(200, todo)
	})

	r.PATCH("/todos/:id", func(c *gin.Context) {
		var input todos_database.TodoInput
		c.BindJSON(&input)
		database.UpdateTodo(c.Param("id"), input)
		c.Status(204)
	})

	r.DELETE("/todos/:id", func(c *gin.Context) {
		database.DeleteTodo(c.Param("id"))
		c.Status(204)
	})

	r.Run(":5000")
}
